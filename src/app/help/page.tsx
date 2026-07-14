import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Truck,
  UserCog,
  ShieldCheck,
  Mail,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Find answers to common questions about orders, payments, returns, and your Cartora account.',
};

const topics = [
  {
    icon: ShoppingBag,
    title: 'Browsing & Ordering',
    questions: [
      {
        q: 'How do I search for products?',
        a: 'Use the Explore page to search by keyword. You can filter results by category, price range, and rating, then sort by newest, price, or popularity.',
      },
      {
        q: 'Can I save items for later?',
        a: 'Yes — click the heart icon on any product card to add it to your Wishlist. Access your saved items from the Dashboard → Wishlist tab.',
      },
      {
        q: 'How do I apply a coupon code?',
        a: 'On the Cart page, enter your coupon code in the "Coupon Code" field and click Apply. Valid codes like SAVE10 (10% off) or FLAT15 ($15 off) will automatically update your total.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Checkout',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) processed securely through Stripe. Your card details are never stored on our servers.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All payment processing is handled by Stripe, a PCI Level 1 certified payment processor. We never see, store, or transmit your full card number.',
      },
      {
        q: 'Why was my payment declined?',
        a: 'Common reasons include insufficient funds, incorrect card details, or your bank blocking online transactions. Please verify your card information or contact your bank.',
      },
    ],
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    questions: [
      {
        q: 'How much does shipping cost?',
        a: 'Orders of $150 or more ship free. Orders under $150 have a flat-rate shipping fee of $15.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are processed within 1–2 business days. Standard delivery typically takes 5–7 business days after dispatch.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once shipped, a tracking notification is sent to your account. You can also view your order status from Dashboard → Orders.',
      },
    ],
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy. Items must be unworn, unwashed, and have all original tags attached. See our full Shipping & Returns page for details.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our support team via the Contact page or email support@cartora.app with your order number. We will send you a prepaid return label.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5–7 business days after we receive and inspect your returned items. The refund goes back to your original payment method.',
      },
    ],
  },
  {
    icon: UserCog,
    title: 'Account & Profile',
    questions: [
      {
        q: 'How do I update my profile information?',
        a: 'Go to Dashboard → Profile to update your name and phone number. Changes are saved immediately.',
      },
      {
        q: 'How do I manage my saved addresses?',
        a: 'Navigate to Dashboard and scroll to the Saved Addresses section. You can add up to 10 addresses, set a default, and delete ones you no longer need.',
      },
      {
        q: 'I forgot my password. What do I do?',
        a: 'Currently, please contact our support team at support@cartora.app with your registered email to reset your password.',
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & Security',
    questions: [
      {
        q: 'What data do you collect?',
        a: 'We collect only what is needed to fulfill orders: your name, email, shipping addresses, and order history. We never sell your data. See our Privacy Policy for full details.',
      },
      {
        q: 'How do I delete my account?',
        a: 'To request account deletion, contact privacy@cartora.app. We will remove your personal data within 30 days.',
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="bg-primary/10 p-3 rounded-xl text-primary w-fit mx-auto">
          <Search className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Help Center
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Find answers to frequently asked questions about shopping, payments, shipping, and your account.
        </p>
      </div>

      {/* FAQ Topics */}
      <div className="space-y-8">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <section key={topic.title} className="rounded-xl border bg-card/25 overflow-hidden">
              {/* Topic Header */}
              <div className="flex items-center gap-3 border-b px-5 py-4 bg-muted/20">
                <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-bold text-foreground">{topic.title}</h2>
              </div>

              {/* Questions */}
              <div className="divide-y">
                {topic.questions.map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3.5 text-xs font-semibold text-foreground hover:bg-muted/10 transition-colors list-none [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <div className="px-5 pb-4 pt-0 text-xs text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="rounded-xl border bg-primary/5 p-6 sm:p-8 text-center space-y-3">
        <h3 className="text-base font-bold text-foreground">Still need help?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Can&apos;t find the answer you&apos;re looking for? Our support team is happy to help.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
