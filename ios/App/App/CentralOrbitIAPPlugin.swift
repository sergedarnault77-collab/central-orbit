import Foundation
import Capacitor
import StoreKit

/// Native StoreKit 2 plugin for Central Orbit IAP
@objc(CentralOrbitIAPPlugin)
public class CentralOrbitIAPPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CentralOrbitIAP"
    public let jsName = "CentralOrbitIAP"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getProducts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restorePurchases", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "checkEntitlements", returnType: CAPPluginReturnPromise),
    ]

    private var products: [String: Product] = [:]
    private var updateListenerTask: Task<Void, Error>?

    override public func load() {
        // Start listening for transaction updates (renewals, revocations, etc.)
        updateListenerTask = listenForTransactionUpdates()
    }

    deinit {
        updateListenerTask?.cancel()
    }

    // MARK: - Plugin Methods

    /// Initialize the store and preload products
    @objc func initialize(_ call: CAPPluginCall) {
        guard let productIds = call.getArray("productIds", String.self) else {
            call.reject("Missing productIds parameter")
            return
        }

        Task {
            do {
                let storeProducts = try await Product.products(for: Set(productIds))
                for product in storeProducts {
                    products[product.id] = product
                }
                call.resolve([
                    "success": true,
                    "productCount": storeProducts.count
                ])
            } catch {
                call.reject("Failed to load products: \(error.localizedDescription)")
            }
        }
    }

    /// Get product information with localized pricing
    @objc func getProducts(_ call: CAPPluginCall) {
        guard let productIds = call.getArray("productIds", String.self) else {
            call.reject("Missing productIds parameter")
            return
        }

        Task {
            do {
                let storeProducts = try await Product.products(for: Set(productIds))
                var result: [[String: Any]] = []

                for product in storeProducts {
                    products[product.id] = product

                    var productInfo: [String: Any] = [
                        "id": product.id,
                        "title": product.displayName,
                        "description": product.description,
                        "price": product.displayPrice,
                        "priceAmount": NSDecimalNumber(decimal: product.price).doubleValue,
                        "currency": product.priceFormatStyle.currencyCode ?? "USD",
                    ]

                    // Add subscription period if applicable
                    if let subscription = product.subscription {
                        let period = subscription.subscriptionPeriod
                        let periodString: String
                        switch period.unit {
                        case .day: periodString = "\(period.value) day\(period.value > 1 ? "s" : "")"
                        case .week: periodString = "\(period.value) week\(period.value > 1 ? "s" : "")"
                        case .month: periodString = "\(period.value) month\(period.value > 1 ? "s" : "")"
                        case .year: periodString = "\(period.value) year\(period.value > 1 ? "s" : "")"
                        @unknown default: periodString = "unknown"
                        }
                        productInfo["period"] = periodString
                    }

                    result.append(productInfo)
                }

                call.resolve(["products": result])
            } catch {
                call.reject("Failed to fetch products: \(error.localizedDescription)")
            }
        }
    }

    /// Purchase a product
    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Missing productId parameter")
            return
        }

        Task {
            // Ensure product is loaded
            if products[productId] == nil {
                do {
                    let storeProducts = try await Product.products(for: [productId])
                    for product in storeProducts {
                        products[product.id] = product
                    }
                } catch {
                    call.reject("Product not found: \(error.localizedDescription)")
                    return
                }
            }

            guard let product = products[productId] else {
                call.reject("Product not available")
                return
            }

            do {
                let result = try await product.purchase()

                switch result {
                case .success(let verification):
                    let transaction = try checkVerified(verification)

                    // Finish the transaction
                    await transaction.finish()

                    var response: [String: Any] = [
                        "transactionId": String(transaction.id),
                        "productId": transaction.productID,
                        "purchaseDate": Int(transaction.purchaseDate.timeIntervalSince1970 * 1000),
                    ]

                    if let expirationDate = transaction.expirationDate {
                        response["expiresDate"] = Int(expirationDate.timeIntervalSince1970 * 1000)
                    }

                    call.resolve(response)

                case .userCancelled:
                    call.reject("USER_CANCELLED", "Purchase was cancelled by user", nil)

                case .pending:
                    call.reject("PENDING", "Purchase is pending approval (e.g., Ask to Buy)", nil)

                @unknown default:
                    call.reject("Unknown purchase result")
                }
            } catch {
                call.reject("Purchase failed: \(error.localizedDescription)")
            }
        }
    }

    /// Restore purchases - check transaction history
    @objc func restorePurchases(_ call: CAPPluginCall) {
        Task {
            var transactions: [[String: Any]] = []

            // Iterate through all verified transactions
            for await result in Transaction.currentEntitlements {
                do {
                    let transaction = try checkVerified(result)

                    let isActive: Bool
                    if let expirationDate = transaction.expirationDate {
                        isActive = expirationDate > Date() && transaction.revocationDate == nil
                    } else {
                        isActive = transaction.revocationDate == nil
                    }

                    var txInfo: [String: Any] = [
                        "transactionId": String(transaction.id),
                        "productId": transaction.productID,
                        "purchaseDate": Int(transaction.purchaseDate.timeIntervalSince1970 * 1000),
                        "isActive": isActive,
                    ]

                    if let expirationDate = transaction.expirationDate {
                        txInfo["expiresDate"] = Int(expirationDate.timeIntervalSince1970 * 1000)
                    }

                    transactions.append(txInfo)
                } catch {
                    // Skip unverified transactions
                    continue
                }
            }

            call.resolve(["transactions": transactions])
        }
    }

    /// Check current entitlements (active subscriptions)
    @objc func checkEntitlements(_ call: CAPPluginCall) {
        Task {
            var isProActive = false
            var expiresDate: Int?
            var transactionId: String?

            for await result in Transaction.currentEntitlements {
                do {
                    let transaction = try checkVerified(result)

                    // Check if this is our Pro subscription
                    if transaction.productID == "com.centralorbit.pro.annual" {
                        if let expDate = transaction.expirationDate {
                            if expDate > Date() && transaction.revocationDate == nil {
                                isProActive = true
                                expiresDate = Int(expDate.timeIntervalSince1970 * 1000)
                                transactionId = String(transaction.id)
                            }
                        }
                    }
                } catch {
                    continue
                }
            }

            var response: [String: Any] = ["isProActive": isProActive]
            if let expires = expiresDate {
                response["expiresDate"] = expires
            }
            if let txId = transactionId {
                response["transactionId"] = txId
            }

            call.resolve(response)
        }
    }

    // MARK: - Helpers

    /// Verify a StoreKit transaction
    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let safe):
            return safe
        }
    }

    /// Listen for transaction updates (renewals, revocations, refunds)
    private func listenForTransactionUpdates() -> Task<Void, Error> {
        return Task.detached {
            for await result in Transaction.updates {
                do {
                    let transaction = try self.checkVerified(result)
                    await transaction.finish()

                    // Notify the web layer about subscription changes
                    self.notifyListeners("subscriptionUpdate", data: [
                        "transactionId": String(transaction.id),
                        "productId": transaction.productID,
                        "isRevoked": transaction.revocationDate != nil,
                    ])
                } catch {
                    // Transaction verification failed
                    print("[CentralOrbitIAP] Transaction update verification failed: \(error)")
                }
            }
        }
    }
}
