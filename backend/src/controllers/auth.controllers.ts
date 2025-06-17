// controllers are to
// 1. validate a request
// 2. call service
// 3. return response

import { Request, Response } from "express";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";

export const registerHandler = async (req: Request, res: Response) => {
    // validate request
    // parse is a Zod method no need to import since it comes from registerSchema export
    // request is an object with email, password, userAgent, confirmPassword
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"], // tells what browser/device made the request is optional
    });

    // call service
    const { user, accessToken, refreshToken } = await createAccount(request);

    // return response
    setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(user);
};

export const loginHandler = async (req: Request, res: Response) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"], // tells what browser/device made the request is optional
    });

    // call service
    const { accessToken, refreshToken } = await loginUser(request);

    //when user logs in they get access and refresh token
    setAuthCookies({ res, accessToken, refreshToken })
        .status(OK)
        .json({ message: "Login successful" });
};
