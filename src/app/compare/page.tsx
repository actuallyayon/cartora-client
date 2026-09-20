'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AiCompareStudio } from '@/features/ai/components/ai-compare-studio';

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');

  const initialProductIds = React.useMemo(() => {
    if (!idsParam) return [];
    return idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
  }, [idsParam]);

  return <AiCompareStudio initialProductIds={initialProductIds} />;
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Hero Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Gemini 3.7 Powered Comparison Engine
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Compare with <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">AI Intelligence</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Select 2 to 4 products from Cartora’s catalog to see a deep, objective side-by-side analysis, dimensional score breakdowns, and personalized recommendations.
          </p>
        </div>

        {/* Client Comparison Studio wrapped in Suspense for search params */}
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
              <div className="text-center text-sm text-muted-foreground">Loading Compare Studio...</div>
            </div>
          }
        >
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}
