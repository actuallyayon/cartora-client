'use client';

import * as React from 'react';
import { Mail, Phone, MapPin, Send, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('general');
  const [message, setMessage] = React.useState('');
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setIsPending(true);

    // Simulate API delay
    setTimeout(() => {
      toast.success('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
      setName('');
      setEmail('');
      setSubject('general');
      setMessage('');
      setIsPending(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Intro Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contact our team
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Have a question about product sizing, returns, or order status? Send us a message and we&apos;ll help you out!
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 max-w-5xl mx-auto">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card/45 p-6 space-y-6">
            <h3 className="text-base font-semibold text-foreground border-b pb-2 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Get in Touch
            </h3>

            {/* Info Items */}
            <div className="space-y-4 text-xs">
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded text-primary shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">Support email</p>
                  <p className="text-muted-foreground">support@cartora.app</p>
                  <p className="text-muted-foreground">response time: &lt; 24 hrs</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">Customer service phone</p>
                  <p className="text-muted-foreground">+1 (800) 555-0199</p>
                  <p className="text-muted-foreground">Mon - Fri, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">Design Headquarters</p>
                  <p className="text-muted-foreground">Cartora Industries, Suite 400</p>
                  <p className="text-muted-foreground">500 Fashion Avenue, New York, NY 10018</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card/20 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">Subject</label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  disabled={isPending}
                >
                  <option value="general">General Inquiry</option>
                  <option value="orders">Order Sizing & Shipping</option>
                  <option value="returns">Refunds & Returns</option>
                  <option value="vendors">Vendor Partnership</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">Message *</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  required
                  disabled={isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-xs h-9"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Submit Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
