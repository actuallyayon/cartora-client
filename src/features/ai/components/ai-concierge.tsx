'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Loader2,
  ShoppingCart,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAiChat } from '@/features/ai/use-ai';
import type { AiChatMessage, AiProductRecommendation } from '@/features/ai/ai.types';
import { useAddToCart } from '@/features/cart/use-cart';
import { useAuth } from '@/features/auth/use-auth';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

let messageCounter = 0;
const createMessageId = () => `msg_${++messageCounter}_${Math.random().toString(36).slice(2, 7)}`;

const INITIAL_MESSAGE: AiChatMessage = {
  id: 'welcome',
  role: 'model',
  content:
    "Hello! 👋 I'm **Cartora AI**, your personal shopping concierge. I'm connected directly to our live catalog. Looking for product recommendations, gift ideas, sizing advice, or deals? Just ask me below!",
  createdAt: new Date(),
  suggestedQueries: [
    '🔥 What are your best sellers?',
    '🎁 Gift recommendations under $50',
    '👕 Men’s & Women’s trending apparel',
    '💳 Do you have any promo discounts?',
  ],
};

export function AiConcierge() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<AiChatMessage[]>([INITIAL_MESSAGE]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const aiChat = useAiChat();
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || aiChat.isPending) return;

    const userMessage: AiChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');

    // Prepare history for API
    const historyPayload = nextMessages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    aiChat.mutate(
      {
        message: text,
        history: historyPayload,
        currentPath: pathname,
      },
      {
        onSuccess: (res) => {
          const aiMessage: AiChatMessage = {
            id: createMessageId(),
            role: 'model',
            content: res.reply,
            createdAt: new Date(),
            products: res.products,
            suggestedQueries: res.suggestedQueries,
          };
          setMessages((prev) => [...prev, aiMessage]);
        },
        onError: () => {
          const errorMessage: AiChatMessage = {
            id: createMessageId(),
            role: 'model',
            content:
              "I'm sorry, I encountered a temporary hiccup connecting to the AI service. Please try asking again in a moment!",
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      },
    );
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    toast.info('Conversation restarted');
  };

  const handleAddToCart = (product: AiProductRecommendation) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart');
      return;
    }
    addToCart.add(product.id, 1);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Shopping Concierge"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-violet-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
          >
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-slate-950 shadow-sm animate-pulse">
              AI
            </div>
            <Sparkles className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
          </button>
        )}
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex h-[85vh] max-h-[640px] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md transition-all sm:right-6 sm:bottom-6 sm:left-auto sm:w-[420px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-linear-to-r from-violet-600/10 via-indigo-500/10 to-transparent px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-tr from-violet-600 to-indigo-500 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground">Cartora AI</h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Live Concierge
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">Powered by Gemini 3.6 Flash</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleClearHistory}
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-xs'
                      : 'bg-muted/70 text-foreground border border-border/50 rounded-bl-xs',
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Render Attached Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                      Matched Products
                    </p>
                    <div className="grid gap-2">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 transition-all hover:border-primary/40 hover:shadow-sm"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={p.thumbnail}
                              alt={p.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="font-medium text-xs text-foreground hover:text-primary transition-colors line-clamp-1 flex items-center gap-1"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                            </Link>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="font-semibold text-xs text-foreground">
                                {formatPrice(p.price, p.currency)}
                              </span>
                              {p.compareAtPrice ? (
                                <span className="text-[11px] text-muted-foreground line-through">
                                  {formatPrice(p.compareAtPrice, p.currency)}
                                </span>
                              ) : null}
                              <span
                                className={cn(
                                  'text-[10px] px-1.5 py-0.2 rounded font-medium',
                                  p.stock > 0
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-destructive/10 text-destructive',
                                )}
                              >
                                {p.stock > 0 ? 'In Stock' : 'Sold Out'}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 px-2.5 text-xs shrink-0 gap-1 hover:bg-primary hover:text-primary-foreground transition-all"
                            disabled={p.stock <= 0 || addToCart.isPending}
                            onClick={() => handleAddToCart(p)}
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Suggested Chips if latest AI message */}
                {msg.suggestedQueries &&
                  msg.suggestedQueries.length > 0 &&
                  msg.id === messages[messages.length - 1]?.id && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 w-full">
                      {msg.suggestedQueries.map((query, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(query)}
                          className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {aiChat.isPending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
                <span>Cartora AI is analyzing store catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="border-t border-border bg-card p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, sizing, deals..."
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={aiChat.isPending}
              />
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground"
                disabled={!input.trim() || aiChat.isPending}
              >
                {aiChat.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
