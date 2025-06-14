// used to be in authRoutes.controller.ts but moved to not clutter

import z from "zod";

const emailSchema = z.string().email().min(1).max(255);
const passwordSchema = z.string().min(6).max(255);

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
    .extend({
        confirmPassword: z.string().min(6).max(255),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// BEFORE
// export const registerSchema = z
// .object({
//     email: z.string().email().min(1).max(255),
//     password: z.string().min(6).max(255),
//     confirmPassword: z.string().min(6).max(255),
//     userAgent: z.string().optional(),
// })
// .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
// });
