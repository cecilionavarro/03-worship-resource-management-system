import {
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED,
} from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import {
    RefreshTokenPayload,
    refreshTokenSignOptions,
    signToken,
    verifyToken,
} from "../utils/jwt";

export type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
    // verify existing user doesn't exist

    // exists takes in a key-value pair or multiple fields
    // returns null if no match or an object id
    const existingUser = await UserModel.exists({
        email: data.email,
    });

    // if user exists throw an error
    appAssert(!existingUser, CONFLICT, "Email already in use");

    // create user
    // .create() - Model.create(documents, [callback]) documents can be a single object or an array of objects
    const user = await UserModel.create({
        email: data.email,
        password: data.password,
    });

    const userId = user.id;
    // create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId: userId,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow(),
    });

    // send verification email

    // create session (unit of time user is logged in to)
    const session = await SessionModel.create({
        userId: userId,
        userAgent: data.userAgent,
    });

    // sign access token & refresh token
    const refreshToken = signToken(
        {
            sessionId: session._id,
        },
        refreshTokenSignOptions
    );

    const accessToken = signToken({
        userId: userId,
        sessionId: session._id,
    });

    // return user & token
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};

export type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const loginUser = async ({
    email,
    password,
    userAgent,
}: LoginParams) => {
    // get the user by email
    const user = await UserModel.findOne({ email });
    appAssert(user, UNAUTHORIZED, "Invalid email or password"); // keep vauge so they don't know which one it is

    //validate password from request
    const isValid = await user.comparePassword(password); // validate password from the request
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password"); // keep vauge so they don't know which one it is

    const userId = user._id;
    //create a session
    const session = await SessionModel.create({
        userId,
        userAgent,
    });

    const sessionInfo = {
        sessionId: session._id,
    };

    // sign access token & refresh token
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

    const accessToken = signToken({
        ...sessionInfo,
        userId: userId,
    });

    // return user & tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};

// refreshToken looks like
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....=
export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
        // secret: JWT_REFRESH_SECRET - basically saying this
        secret: refreshTokenSignOptions.secret,
    });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

    const session = await SessionModel.findById(payload.sessionId);

    const now = Date.now();
    // check session exists and is in the future
    appAssert(
        session && session.expiresAt.getTime() > now,
        UNAUTHORIZED,
        "Session expired"
    );

    //refresh the session if it expires in the next 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
        ? signToken(
              {
                  sessionId: session._id,
              },
              refreshTokenSignOptions
          )
        : undefined;

    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id,
    });

    return {
        accessToken,
        newRefreshToken,
    };
};
// validCode looks like: 
// {
//   _id: new ObjectId('6851d221832a7cbb78c1fbe2'),
//   userId: new ObjectId('6851d221832a7cbb78c1fbe0'),
//   type: 'email_verification',
//   expiresAt: 2026-06-17T20:37:53.640Z,
//   createdAt: 2025-06-17T20:37:53.641Z,
//   __v: 0
// }
export const verifyEmail = async (code: string) => {
    // get the verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeType.EmailVerification,
        expiresAt: { $gt: new Date() },
    });

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    // update user to verified true
    // find the user by Id and update their verified field, return the updated user
    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {
            verified: true,
        },
        { new: true }
    );

    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");
    // delete verification code
    await validCode.deleteOne();

    // return user
    return {
        user: updatedUser.omitPassword(),
    };
};

//  previous for register
// const refreshToken = jwt.sign(
//     { sessionId: session._id },
//     JWT_REFRESH_SECRET,
//     {
//         audience: ["user"],
//         expiresIn: "30d",
//     }
// );
// const accessToken = jwt.sign(
//     {
//         userId: user._id,
//         sessionId: session._id,
//     },
//     JWT_SECRET,
//     {
//         audience: ["user"],
//         expiresIn: "15m",
//     }
// );

// previous way of sign access and refresh token for login
// const refreshToken = jwt.sign(sessionInfo, JWT_REFRESH_SECRET, {
//         audience: ["user"],
//         expiresIn: "30d",
//     });

//     const accessToken = jwt.sign(
//         {
//             ...sessionInfo,
//             userId: user._id,
//         },
//         JWT_SECRET,
//         {
//             audience: ["user"],
//             expiresIn: "15m",
//         }
//     );
