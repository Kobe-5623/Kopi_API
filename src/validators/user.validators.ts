import { z } from 'zod';

const fullName = z.string().trim().min(2).max(255)
        .regex(/^[A-Za-z]+(?:, [A-Za-z]+|[ '-][A-Za-z]+)*$/, 'Fullname may only contain letters, commas, spaces, hyphens, aposthropes, and periods')
        .regex(/[A-Za-z]/, 'Fullname must contain a letter');
const email = z.string().trim().email().max(255).transform((value) => value.toLowerCase());
const phoneNumber = z.string().trim()
        .regex(/^\+639\d{9}$/);
const password = z.string().min(8).max(72)
        .regex(/[A-Za-z]/, 'Password must contain a letter')
        .regex(/\d/, 'Password must contain a number')
        .regex(/^\S+$/, 'Password must not contain spaces');
const confirmPassword = z.string().min(1);
const defaultAddress = z.string().trim().min(2).max(255).optional();

const storeBranchAddress = z.string().trim().min(2).max(255);



export const registerCustomerSchema = z.object({
  fullName, email, phoneNumber, password, confirmPassword, defaultAddress
})
.strict()
.refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ["confirmPassword"],
});

export const registerStaffSchema = z.object({
  email, storeBranchAddress, password, confirmPassword, defaultAddress
})
.strict()
.refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ["confirmPassword"],
});

export const registerOwnerSchema = z.object({
  email, password, confirmPassword, defaultAddress
})
.strict()
.refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ["confirmPassword"],
});


export const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
}).strict();

//INAAYOS MO UNG MGA VALIDATOR NG IBAT IBANG ROLES!!!

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()).optional(),
  phoneNumber: z.string().min(1).optional(),
  currentPassword: z.string().min(1).optional(),
  password: password.optional(),
  confirmPassword: z.string().min(1).optional(),
}).strict().refine((data) => Object.keys(data).some((key) => key !== 'currentPassword' && key !== 'confirmPassword'), {
  message: 'At least one field must be updated',
}).refine((data) => !data.password || Boolean(data.currentPassword), {
  message: 'currentPassword is required to change the password',
  path: ['currentPassword'],
});

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type RegisterStaffInput = z.infer<typeof registerStaffSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;