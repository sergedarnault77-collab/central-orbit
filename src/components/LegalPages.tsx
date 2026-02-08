import { useState } from 'react';

type LegalPage = 'privacy' | 'terms' | 'report';

interface LegalPagesProps {
  page: LegalPage;
  onClose: () => void;
}

export function LegalPages({ page, onClose }: LegalPagesProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {page === 'privacy' && 'Privacy Policy'}
            {page === 'terms' && 'Terms of Service'}
            {page === 'report' && 'Report an Issue'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 pb-8 overflow-y-auto flex-1">
          {page === 'privacy' && <PrivacyContent />}
          {page === 'terms' && <TermsContent />}
          {page === 'report' && <ReportContent onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
      <p className="text-xs text-zinc-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">1. Information We Collect</h3>
        <p>Central Orbit collects the following information when you create an account:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Account Information:</strong> Email address, name, and password (encrypted).</li>
          <li><strong>Usage Data:</strong> Workspaces, tools, and preferences you create within the app.</li>
          <li><strong>Device Information:</strong> Device type, operating system, and app version for troubleshooting.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">2. How We Use Your Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>To provide and maintain the Central Orbit service.</li>
          <li>To sync your workspaces and tools across devices.</li>
          <li>To process subscription payments.</li>
          <li>To send important service updates (you can opt out of marketing emails).</li>
          <li>To improve the app experience and fix bugs.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">3. Data Storage & Security</h3>
        <p>Your data is stored securely using industry-standard encryption. We use Convex as our database provider, which employs encryption at rest and in transit. We do not sell, trade, or rent your personal information to third parties.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">4. Third-Party Services</h3>
        <p>Central Orbit may embed third-party web content within tool tiles. We are not responsible for the privacy practices of these external websites. We encourage you to review their privacy policies.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">5. Data Retention & Deletion</h3>
        <p>Your data is retained as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us. Upon deletion, all your workspaces, tools, and personal information will be permanently removed within 30 days.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">6. Children&apos;s Privacy</h3>
        <p>Central Orbit is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">7. Your Rights</h3>
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access your personal data.</li>
          <li>Correct inaccurate data.</li>
          <li>Request deletion of your data.</li>
          <li>Export your data in a portable format.</li>
          <li>Opt out of marketing communications.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">8. Contact Us</h3>
        <p>If you have questions about this Privacy Policy, please contact us at <span className="text-indigo-600 dark:text-indigo-400">support@centralorbit.app</span>.</p>
      </section>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
      <p className="text-xs text-zinc-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">1. Acceptance of Terms</h3>
        <p>By downloading, installing, or using Central Orbit, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the app.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">2. Description of Service</h3>
        <p>Central Orbit is a workspace management application that allows users to organize web-based tools and services into customizable workspaces. The app provides both free and premium (Pro) subscription tiers.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">3. User Accounts</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>You must be at least 13 years old to use this service.</li>
          <li>One person may not maintain more than one account.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">4. Subscriptions & Payments</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pro subscriptions are billed annually at the current listed price.</li>
          <li>Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.</li>
          <li>Payment is processed through the platform&apos;s payment system (Apple App Store, Google Play, or web payment provider).</li>
          <li>Refunds are handled according to the respective platform&apos;s refund policy.</li>
          <li>We reserve the right to change subscription pricing with 30 days notice.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">5. Acceptable Use</h3>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Use the service for any illegal or unauthorized purpose.</li>
          <li>Store or link to content that is harmful, abusive, or violates others&apos; rights.</li>
          <li>Attempt to gain unauthorized access to the service or its systems.</li>
          <li>Interfere with or disrupt the service or servers.</li>
          <li>Reverse engineer, decompile, or disassemble the application.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">6. Content & URLs</h3>
        <p>Central Orbit allows you to save URLs to third-party websites. We do not control, endorse, or assume responsibility for the content of any third-party website. You access third-party content at your own risk.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">7. Termination</h3>
        <p>We may terminate or suspend your account at any time for violation of these terms. Upon termination, your right to use the service ceases immediately. You may delete your account at any time.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">8. Limitation of Liability</h3>
        <p>Central Orbit is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">9. Changes to Terms</h3>
        <p>We reserve the right to modify these terms at any time. We will notify users of material changes via email or in-app notification. Continued use of the service after changes constitutes acceptance.</p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">10. Contact</h3>
        <p>For questions about these Terms, contact us at <span className="text-indigo-600 dark:text-indigo-400">support@centralorbit.app</span>.</p>
      </section>
    </div>
  );
}

function ReportContent({ onClose }: { onClose: () => void }) {
  const [reportType, setReportType] = useState<string>('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) return;
    // In production, this would send to a backend endpoint
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setDescription('');
      setEmail('');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-500/15 flex items-center justify-center text-3xl mb-4">
          ✅
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Report Submitted</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Thank you for your feedback. We&apos;ll review it shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Help us improve Central Orbit by reporting bugs, inappropriate content, or suggesting features.
      </p>

      <div>
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Report Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'bug', label: '🐛 Bug', desc: 'Something broken' },
            { value: 'content', label: '🚫 Content', desc: 'Inappropriate' },
            { value: 'feature', label: '💡 Feature', desc: 'Suggestion' },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setReportType(type.value)}
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                reportType === type.value
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 border-2 border-indigo-500 dark:border-indigo-400'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
              }`}
            >
              <span className="text-lg block">{type.label.split(' ')[0]}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">{type.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            reportType === 'bug'
              ? 'Describe the bug and steps to reproduce it...'
              : reportType === 'content'
                ? 'Describe the inappropriate content or behavior...'
                : 'Describe the feature you\'d like to see...'
          }
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
          Email (optional, for follow-up)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!description.trim()}
        className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25"
      >
        Submit Report
      </button>
    </div>
  );
}

// Settings section component for embedding legal links
export function SettingsLegalSection() {
  const [activePage, setActivePage] = useState<LegalPage | null>(null);

  return (
    <>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1 mb-2">
          Legal & Support
        </p>
        {[
          { page: 'privacy' as LegalPage, icon: '🔒', label: 'Privacy Policy' },
          { page: 'terms' as LegalPage, icon: '📄', label: 'Terms of Service' },
          { page: 'report' as LegalPage, icon: '🚩', label: 'Report an Issue' },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex-1">{item.label}</span>
            <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ))}
      </div>

      {activePage && (
        <LegalPages page={activePage} onClose={() => setActivePage(null)} />
      )}
    </>
  );
}
