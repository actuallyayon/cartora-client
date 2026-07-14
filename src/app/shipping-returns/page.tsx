import type { Metadata } from 'next';
import { Truck, RotateCcw, ShieldCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Understand shipping rates, dispatch schedules, and returns policies at Cartora.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shipping & Returns
        </h1>
        <p className="text-muted-foreground text-sm">
          Everything you need to know about delivery times, tracking, and product refunds.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Shipping Card */}
        <div className="rounded-xl border bg-card/25 p-6 hover:border-primary/20 transition-colors space-y-4">
          <div className="bg-primary/10 p-2.5 rounded-lg text-primary w-fit">
            <Truck className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Shipping dispatch & rates</h2>
          <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
            <p>
              We process and pack orders Monday through Friday. Standard items ship within 1-2 business days from the moment payment confirmation is completed.
            </p>
            <div className="border-t pt-2 mt-2 space-y-1">
              <p className="text-foreground font-semibold">Standard Shipping Rates:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Orders of $150 or more: <span className="text-emerald-500 font-semibold">FREE Shipping</span></li>
                <li>Orders under $150: Flat-rate fee of <span className="font-semibold text-foreground">$15.00</span></li>
              </ul>
            </div>
            <p>
              Once your package leaves our fulfillment center, we push a shipping confirmation notification directly to your account dashboard with your carrier tracking number (USPS or UPS).
            </p>
          </div>
        </div>

        {/* Returns Card */}
        <div className="rounded-xl border bg-card/25 p-6 hover:border-primary/20 transition-colors space-y-4">
          <div className="bg-primary/10 p-2.5 rounded-lg text-primary w-fit">
            <RotateCcw className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">30-day return policy</h2>
          <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
            <p>
              If your apparel doesn&apos;t fit or isn&apos;t exactly to your liking, you can submit a return claim within 30 days of the delivery stamp.
            </p>
            <div className="border-t pt-2 mt-2 space-y-1">
              <p className="text-foreground font-semibold">Return requirements:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Items must be unwashed, unworn, and contain all original brand tags.</li>
                <li>Footwear must include the original intact shoebox.</li>
                <li>Receipt invoice or order confirmation must be present.</li>
              </ul>
            </div>
            <p>
              Refunds are processed back to your original payment method (Stripe Credit Card) within 5-7 business days from package receipt at our inspection dock.
            </p>
          </div>
        </div>
      </div>

      {/* Return Instructions */}
      <section className="rounded-xl border bg-card/15 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b pb-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          How to process a return
        </h3>
        <div className="grid gap-6 sm:grid-cols-3 text-xs text-muted-foreground">
          <div className="space-y-1.5">
            <span className="bg-primary/15 text-primary flex h-6 w-6 items-center justify-center rounded-full font-bold">1</span>
            <p className="font-semibold text-foreground pt-1">Request a label</p>
            <p className="leading-relaxed">Email our support or open a contact query with your order details to request a prepaid label.</p>
          </div>
          <div className="space-y-1.5">
            <span className="bg-primary/15 text-primary flex h-6 w-6 items-center justify-center rounded-full font-bold">2</span>
            <p className="font-semibold text-foreground pt-1">Pack your items</p>
            <p className="leading-relaxed">Place items securely inside any shipping box and paste the prepaid return label on top.</p>
          </div>
          <div className="space-y-1.5">
            <span className="bg-primary/15 text-primary flex h-6 w-6 items-center justify-center rounded-full font-bold">3</span>
            <p className="font-semibold text-foreground pt-1">Ship it back</p>
            <p className="leading-relaxed">Drop off your package at any authorized UPS or USPS collection bin.</p>
          </div>
        </div>
      </section>

      {/* Footer support prompt */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p className="flex items-center justify-center gap-1.5">
          <Mail className="h-4 w-4" />
          Questions? Drop us an email at <a href="mailto:support@cartora.app" className="text-primary hover:underline font-medium">support@cartora.app</a>.
        </p>
      </div>
    </div>
  );
}
