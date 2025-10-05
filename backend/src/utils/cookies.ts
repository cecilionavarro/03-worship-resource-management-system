import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

export const REFRESH_PATH = "/auth/refresh";
// const secure = process.env.NODE_ENV !== "development"; // send cookies over http in dev env

const defaults: CookieOptions = {
    sameSite: "strict", // prevents cookies from being sent cross-site
    httpOnly: true, // makes cookies inaccessable to JavaScript
    secure: true // conditionally sent based on environment, was a variable before caddy https, now 
};

//cookie with usual rules but add another
export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH,
});

type Params = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

// res.cookie(name, value, options)
export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
    res
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
    res.clearCookie("accessToken").clearCookie("refreshToken", {
        path: REFRESH_PATH,
    });
