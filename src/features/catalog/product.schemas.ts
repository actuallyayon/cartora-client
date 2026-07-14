import { z } from 'zod';

const emptyToUndefined = (v: unknown) => (v === '' || v == null ? undefined : v);

export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(160),
  description: z.string().trim().min(10, 'Add a longer description (10+ chars)'),
  category: z.string().min(1, 'Select a category'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compareAtPrice: z.preprocess(
    emptyToUndefined,
    z.coerce.number().positive('Must be greater than 0').optional(),
  ),
  sku: z.string().trim().min(1, 'SKU is required'),
  stock: z.coerce.number().int('Whole number').min(0, 'Cannot be negative'),
  tags: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

// Input type (form fields are strings) differs from the parsed output type.
export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;
