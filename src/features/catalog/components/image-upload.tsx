'use client';

import * as React from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useUploadImage } from '@/features/catalog/use-catalog';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

/**
 * Multi-image uploader. Each file is sent to the API's ImgBB proxy and the
 * returned URL is appended. The first image is used as the product cover.
 */
export function ImageUpload({ value, onChange, max = 6 }: ImageUploadProps) {
  const upload = useUploadImage();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = max - value.length;
    const picked = Array.from(files).slice(0, remaining);

    for (const file of picked) {
      try {
        const url = await upload.mutateAsync(file);
        onChange([...value, url]);
      } catch (error) {
        const msg = axios.isAxiosError(error)
          ? ((error.response?.data as { message?: string })?.message ?? 'Upload failed')
          : 'Upload failed';
        toast.error(msg);
      }
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={url}
            className="group border-border relative aspect-square overflow-hidden rounded-lg border"
          >
            <Image src={url} alt={`Image ${i + 1}`} fill sizes="150px" className="object-cover" />
            {i === 0 ? (
              <span className="bg-primary text-primary-foreground absolute top-1 left-1 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium">
                <Star className="h-2.5 w-2.5 fill-current" />
                Cover
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => remove(url)}
              aria-label="Remove image"
              className="bg-background/90 text-foreground absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {value.length < max ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className={cn(
              'border-border text-muted-foreground hover:border-primary hover:text-foreground flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed transition-colors',
              upload.isPending && 'pointer-events-none opacity-60',
            )}
          >
            {upload.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
            <span className="text-xs">{upload.isPending ? 'Uploading…' : 'Add'}</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <p className="text-muted-foreground mt-2 text-xs">
        Up to {max} images. The first image is the cover. Max 5MB each.
      </p>
    </div>
  );
}
