'use client';

import * as React from 'react';
import { Sparkles, Wand2, Loader2, Check, ArrowRight, X, Layers, Tag, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGenerateProductDraft } from '@/features/ai/use-ai';
import type { AiGeneratedProductDraft } from '@/features/ai/ai.types';
import { toast } from 'sonner';

interface AiProductCopilotProps {
  onApplyDraft: (draft: AiGeneratedProductDraft) => void;
  currentValues?: {
    name?: string;
    description?: string;
    category?: string;
    price?: string | number;
    tags?: string;
  };
}

const SAMPLE_PROMPTS = [
  'Matte Black Noise-Cancelling Wireless Headphones, 40h battery life, USB-C fast charge, price $89.99',
  '100% Organic French Terry Oversized Hoodie, Vintage Washed Charcoal, unisex fit, price $68',
  'Double-Wall Vacuum Insulated Titanium Water Bottle 750ml, keeps cold 24 hours, price $38',
];

export function AiProductCopilot({ onApplyDraft, currentValues }: AiProductCopilotProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [generatedDraft, setGeneratedDraft] = React.useState<AiGeneratedProductDraft | null>(null);

  const generateDraft = useGenerateProductDraft();

  const handleGenerate = () => {
    if (!prompt.trim() || generateDraft.isPending) return;

    generateDraft.mutate(
      {
        prompt: prompt.trim(),
        existingData: currentValues
          ? {
              name: currentValues.name,
              description: currentValues.description,
              category: currentValues.category,
              price: currentValues.price ? Number(currentValues.price) : undefined,
            }
          : undefined,
      },
      {
        onSuccess: (draft) => {
          setGeneratedDraft(draft);
          toast.success('AI Listing generated successfully!');
        },
        onError: () => {
          toast.error('Failed to generate product draft with AI. Please try again.');
        },
      },
    );
  };

  const handleApply = () => {
    if (!generatedDraft) return;
    onApplyDraft(generatedDraft);
    toast.success('AI listing applied to form fields!');
    setIsOpen(false);
  };

  return (
    <Card className="border-violet-500/30 bg-linear-to-r from-violet-500/5 via-indigo-500/5 to-transparent overflow-hidden mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-violet-600 to-indigo-500 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Gemini AI Product Copilot</CardTitle>
              <CardDescription className="text-xs">
                Draft full listings, write rich marketing copy, tags, and pricing with 1 click.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant={isOpen ? 'outline' : 'default'}
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={isOpen ? '' : 'bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm'}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
            <span>{isOpen ? 'Close Copilot' : '✨ Open AI Studio'}</span>
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4 pt-0 border-t border-border/60 mt-3 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              Describe your product concept or paste raw notes/supplier specs:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Ultra-warm merino wool crewneck sweater in midnight navy, seamless knit, retail around $75..."
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>

          {/* Prompt chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Try sample prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="rounded-md border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
                >
                  {p.slice(0, 50)}...
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              disabled={!prompt.trim() || generateDraft.isPending}
              onClick={handleGenerate}
              className="bg-primary text-primary-foreground gap-1.5"
            >
              {generateDraft.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{generateDraft.isPending ? 'Generating with Gemini...' : 'Generate Listing'}</span>
            </Button>
          </div>

          {/* Generated Draft Preview */}
          {generatedDraft && (
            <div className="mt-4 rounded-xl border border-violet-500/20 bg-card p-4 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>AI Generated Listing Preview</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApply}
                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                >
                  <span>Apply All to Form</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid gap-3 text-xs">
                <div>
                  <span className="font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <FileText className="h-3.5 w-3.5" /> Product Title
                  </span>
                  <p className="font-medium text-foreground bg-muted/40 p-2 rounded-md">
                    {generatedDraft.name}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <FileText className="h-3.5 w-3.5" /> Marketing Description
                  </span>
                  <p className="text-foreground/90 bg-muted/40 p-2.5 rounded-md leading-relaxed whitespace-pre-wrap">
                    {generatedDraft.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-muted/40 p-2 rounded-md">
                    <span className="text-[10px] text-muted-foreground block flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Price
                    </span>
                    <span className="font-semibold text-foreground">${generatedDraft.suggestedPrice}</span>
                  </div>
                  <div className="bg-muted/40 p-2 rounded-md">
                    <span className="text-[10px] text-muted-foreground block flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Compare Price
                    </span>
                    <span className="font-semibold text-foreground">
                      ${generatedDraft.suggestedCompareAtPrice || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-muted/40 p-2 rounded-md">
                    <span className="text-[10px] text-muted-foreground block flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Category
                    </span>
                    <span className="font-semibold text-foreground line-clamp-1">
                      {generatedDraft.suggestedCategoryName}
                    </span>
                  </div>
                  <div className="bg-muted/40 p-2 rounded-md">
                    <span className="text-[10px] text-muted-foreground block flex items-center gap-1">
                      <Tag className="h-3 w-3" /> SKU
                    </span>
                    <span className="font-semibold text-foreground">{generatedDraft.suggestedSku}</span>
                  </div>
                </div>

                {generatedDraft.tags && generatedDraft.tags.length > 0 && (
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {generatedDraft.tags.map((tag, i) => (
                        <span key={i} className="rounded bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
