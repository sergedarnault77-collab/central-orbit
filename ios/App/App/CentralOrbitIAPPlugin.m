#import <Capacitor/Capacitor.h>

CAP_PLUGIN(CentralOrbitIAPPlugin, "CentralOrbitIAP",
    CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getProducts, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(purchase, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(restorePurchases, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(checkEntitlements, CAPPluginReturnPromise);
)
