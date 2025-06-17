import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development"; // send cookies over http in dev env 

const defaults: CookieOptions = {
    sameSite: "strict", // prevents cookies from being sent cross-site
    httpOnly: true, // makes cookies inaccessable to JavaScript
    secure, // conditionally sent based on environment
};

//cookie with usual rules but add another
const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: "/auth/refresh",
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
