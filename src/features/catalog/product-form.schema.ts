import { z } from 'zod';

const isPositive = (v: string) => Number(v) > 0;

/** Form values are strings (native inputs); converted to numbers on submit. */
export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(160),
  description: z.string().trim().min(10, 'Add a longer description (10+ chars)'),
  category: z.string().min(1, 'Select a category'),
  price: z.string().min(1, 'Price is required').refine(isPositive, 'Price must be greater than 0'),
  compareAtPrice: z
    .string()
    .optional()
    .refine((v) => !v || Number(v) > 0, 'Must be greater than 0'),
  sku: z.string().trim().min(1, 'SKU is required'),
  stock: z
    .string()
    .min(1, 'Stock is required')
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, 'Enter a whole number'),
  tags: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  sizes: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
