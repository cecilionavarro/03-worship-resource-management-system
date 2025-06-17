import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

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
    console.log(existingUser);

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
