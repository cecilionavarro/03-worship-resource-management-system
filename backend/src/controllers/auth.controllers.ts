// controllers are to
// 1. validate a request
// 2. call service
// 3. return response

import z from "zod";
import { Request, Response } from "express";

const registerSchema = z
    .object({
        email: z.string().email().min(1).max(255),
        password: z.string().min(6).max(255),
        confirmPassword: z.string().min(6).max(255),
        userAgent: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const registerHandler = async (req: Request, res: Response) => {
    //validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"], // tells what browser/device made the request is optional
    });
};
