import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Used by every UI component (shadcn convention).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
