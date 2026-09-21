import { z } from 'zod';
import { CATEGORY } from '../constants/product.js';

const name = z.string().trim().min(2).max(50).regex(/[A-Za-z]/, 'Name must contain a letter');
const category = z.enum(CATEGORY);
const description = z.string().trim().min(2).max(255).regex(/[A-Za-z]/, 'Name must contain a letter');
const price = z.coerce.number().finite().nonnegative({ message: 'Price cannot be negative' })
        .refine((value) => Number.isInteger(value * 100), { message: 'Price can only have 2 decimals' });
const isHotAvailable = z.boolean();
const isIcedAvailable = z.boolean();

export const newProductSchema = z.object({
  name,
  category,
  description,
  price,
  isHotAvailable,
  isIcedAvailable: z.boolean(),
}).strict();

export const updateProductSchema = z.object({
  name: name.optional(),
  category: category.optional(),
  description: description.optional(),
  price: price.optional(),
  isHotAvailable: isHotAvailable.optional(),
  isIcedAvailable: isIcedAvailable.optional(),
}).strict()
.refine(data => Object.keys(data).length > 0, { message: 'At least one field must be updated' });

export type newProductInput = z.infer<typeof newProductSchema>;
export type updateProductInput = z.infer<typeof updateProductSchema>;