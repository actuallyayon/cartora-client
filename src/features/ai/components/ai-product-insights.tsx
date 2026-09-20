'use client';

import * as React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  UserCheck,
  RotateCw,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useProductInsights } from '@/features/ai/use-ai';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AiProductInsights({ productId }: { productId: string }) {
  const { data: insights, isLoading, isError, refetch, isFetching } = useProductInsights(productId);

  if (isLoading) {
    return (
      <div className="mt-12 rounded-2xl border border-border/80 bg-linear-to-b from-muted/40 to-muted/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Gemini AI Product Intelligence</h3>
            <p className="text-xs text-muted-foreground">Synthesizing customer reviews, specs, and performance...</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !insights) {
    return null;
  }

  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-violet-500/20 bg-linear-to-b from-violet-500/5 via-background to-background p-6 shadow-sm transition-all sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Gemini AI Product Intelligence
              </h3>
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">
                Verified Synthesis
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time analysis of buyer feedback, material specs, and real-world durability.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="h-4 w-4 shrink-0" />
            <span className="text-xs font-semibold">{insights.buyerMatchScore}% Buyer Match</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Refresh AI analysis"
          >
            <RotateCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-5 rounded-xl border border-border/60 bg-card/60 p-4">
        <p className="text-sm leading-relaxed text-foreground font-medium">
          {insights.summary}
        </p>
        {insights.verdict && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong className="text-foreground">AI Verdict:</strong> {insights.verdict}
            </span>
          </div>
        )}
      </div>

      {/* Pros & Cons Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Pros */}
        <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Top Highlights & Praised Features</span>
          </div>
          <ul className="space-y-2 text-xs text-foreground/90 leading-relaxed">
            {insights.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons / Considerations */}
        <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Points to Consider</span>
          </div>
          <ul className="space-y-2 text-xs text-foreground/90 leading-relaxed">
            {insights.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ideal For Persona Tags */}
      {insights.idealFor && insights.idealFor.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-1">
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Ideal For:</span>
          </div>
          {insights.idealFor.map((persona, index) => (
            <span
              key={index}
              className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
            >
              {persona}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
