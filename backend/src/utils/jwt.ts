import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

// i understood after about an hour and a half
// user is taken out because it is the default for both
// secret has to have its type because its defined somewhere else
// first 2 exports are for the payload and the rest are for the options

// define structure of data in
// get type of _id from sessionDocument interface
// sessionId: mongoose.Types.ObjectId; basically the same
export type RefreshTokenPayload = {
    sessionId: SessionDocument["_id"];
};

// defines the structure for the payload
export type AccessTokenPayload = {
    userId: UserDocument["_id"];
    sessionId: SessionDocument["_id"];
};

// combines and adds a 'secret' field to SignOptions
type SignOptionsAndSecret = SignOptions & {
    secret: string;
};

// sets default options of token audience to user - who its meant for
const defaults: SignOptions = {
    audience: ["user"],
};

//SignOptions already has secret so no need to declare in types
const accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "15m",
    secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET,
};

// jwt.sign(payload, secretOrPrivateKey, [options, callback])
export const signToken = (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?: SignOptionsAndSecret
) => {
    // destructuring to extract secret from options / accessTokenSignOptions
    const { secret, ...signOpts } = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

/*
    verifyToken function can accept and return any kind of object as a token's payload
    If not specified will assume payload looks like AccessTokenPayload
    TPayload is constrained to object and defaults to AccessTokenPayload
    extends - constraints in generics. For interfaces its for inheritence and extension
    Prevents accidentally passing something like a string, number, or boolean.
    Return type is Tpayload or error
*/

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
    token: string,
    //VerifyOptions just gives the fields adding secret field on top of that
    options?: VerifyOptions & { secret?: string }
) => {
    // defaults to JWT_SECRET but using JWT_REFRESH_SECRET in refreshUserAccessToken
    //...verifyOpts is to extract secret and leave the rest
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};
    try {
        // payload is as follows:
        // {
        // sessionId: '6851d233832a7cbb78c1fbea',
        // iat: 1750192691,
        // exp: 1752784691,
        // aud: [ 'user' ]
        // }
        // default adds
        // {
        //     audience: ["user"] -> aud: [ 'user' ]
        // }
        // options enforced by me
        const payload = jwt.verify(token, secret, {
            ...defaults, // adds { audience: ["user"] }
            ...verifyOpts, // nothing extra in this case add more fields than just secret for it to add something
        }) as TPayload;
        return {
            payload,
        };
    } catch (error: any) {
        return {
            error: error.message,
        };
    }
};
