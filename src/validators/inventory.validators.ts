import { z } from 'zod';
import { UNIT } from '../constants/inventory.js';

const name = z.string().trim().min(2).max(50)
      .regex(/[A-Za-z]/, 'Fullname must contain a letter');
const quantity = z.coerce.number()
      .int({ message: 'Quantity must be a whole number' });
const unit = z.enum(UNIT);


export const newStockSchema = z.object({
  name,
  quantity: quantity.nonnegative({ message: 'Quantity cannot be negative' }).optional(),
  unit,
}).strict();

export const incrementStockSchema = z.object({
  name,
  quantity: quantity.positive({ message: 'Quantity to increment must be atleast 1' }),
}).strict();

export const decrementStockSchema = z.object({
  name,
  quantity: quantity.positive({ message: 'Quantity to decrement must be atleast 1' }),
}).strict();


export type NewStockInput = z.infer<typeof newStockSchema>;
export type IncrementStockInput = z.infer<typeof incrementStockSchema>;
export type DecrementStockInput = z.infer<typeof decrementStockSchema>;