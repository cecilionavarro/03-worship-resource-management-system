// controllers are to
// 1. validate a request
// 2. call service
// 3. return response

import { Request, Response } from "express";
import {
    createAccount,
    loginUser,
    refreshUserAccessToken,
    resetPassword,
    sendPasswordResetEmail,
    verifyEmail,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
    clearAuthCookies,
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthCookies,
} from "../utils/cookies";
import {
    emailSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verificationCodeSchema,
} from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

export const registerHandler = async (req: Request, res: Response) => {
    // validate request
    // parse is a Zod method no need to import since it comes from registerSchema export it throws an error if refine fails
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

export const logoutHandler = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    const { payload } = verifyToken(accessToken || "");

    console.log(payload);

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }
    clearAuthCookies(res).status(OK).json({
        message: "Logout successful",
    });
};

export const refreshHandler = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    // accessToken always new, newRefreshToken sometimes new
    const { accessToken, newRefreshToken } =
        await refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
        res.cookie(
            "refreshToken",
            newRefreshToken,
            getRefreshTokenCookieOptions()
        );
    }

    res.status(OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({
            message: "Access token refreshed",
        });
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
    // req.params.code means :code section of the URL
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(verificationCode);

    res.status(OK).json({
        message: "Email was succesfully verified",
    });
};

export const sendPasswordResetHandler = async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);

    await sendPasswordResetEmail(email);

    res.status(OK).json({
        message: "Password reset email sent",
    });
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);

    clearAuthCookies(res).status(OK).json({
        message: "Password reset successful",
    });
};
