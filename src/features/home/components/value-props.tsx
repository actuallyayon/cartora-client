import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

/** Genuine platform promises (no fabricated metrics). */
const props = [
  { icon: Truck, title: 'Fast, free shipping', desc: 'On every order over $50.' },
  { icon: RotateCcw, title: 'Easy 30-day returns', desc: 'Changed your mind? No problem.' },
  { icon: ShieldCheck, title: 'Secure checkout', desc: 'Encrypted payments via Stripe.' },
  { icon: Headphones, title: 'Here to help', desc: 'Friendly support, always.' },
];

export function ValueProps() {
  return (
    <section className="border-border bg-muted/30 border-y">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {props.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <p.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{p.title}</h3>
              <p className="text-muted-foreground mt-0.5 text-sm">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
