import type { Metadata } from 'next';
import { ShieldCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Cartora protects, handles, and manages customer data privacy.',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b pb-6 space-y-2">
        <div className="bg-primary/10 p-2 rounded-lg text-primary w-fit">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-xs">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Content */}
      <div className="text-xs text-muted-foreground space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect the narrowest scope of personal data required to manage your profile and process order fulfillment:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><span className="font-semibold text-foreground">Account Info:</span> Your name, email address, password, and optional phone numbers.</li>
            <li><span className="font-semibold text-foreground">Delivery Data:</span> Saved shipping addresses (up to 10 records per user) that you enter inside your address book.</li>
            <li><span className="font-semibold text-foreground">Order details:</span> Items purchased, transaction counts, shipping totals, and coupon codes applied.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-foreground">2. Payment Security & Integrity</h2>
          <p>
            Your payment card credentials (credit card numbers, CVC, expiry dates) are never stored, transmitted, or logged directly on our servers.
          </p>
          <p>
            All financial operations are routed directly to Stripe. Checkout maps are processed securely using Stripe card elements. Webhooks handle raw transaction verification to finalize orders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-foreground">3. How We Use Data</h2>
          <p>
            We use your data strictly to:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Process and ship your product orders.</li>
            <li>Send order status update notifications to your account bell icon dropdown.</li>
            <li>Verify coupon codes and checkout validity.</li>
            <li>Enable product review validations.</li>
          </ul>
          <p>
            We never sell, distribute, or share customer data with third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-foreground">4. Cookies & Trackers</h2>
          <p>
            We use standard secure session cookies to verify your login status (auth tokens). These are strictly functional and do not track cross-website search histories.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-foreground">5. Your Rights</h2>
          <p>
            You have the right to request access to your saved address books, view your order histories, edit your profile details (name and phone numbers), or request account deletion.
          </p>
        </section>
      </div>

      {/* Support footer */}
      <div className="text-center text-xs text-muted-foreground pt-6 border-t">
        <p className="flex items-center justify-center gap-1.5">
          <Mail className="h-4 w-4" />
          Questions about your data? Contact us at <a href="mailto:privacy@cartora.app" className="text-primary hover:underline font-medium">privacy@cartora.app</a>.
        </p>
      </div>
    </div>
  );
}
