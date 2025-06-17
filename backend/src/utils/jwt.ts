import jwt, { SignOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

// i understood after about an hour and a half
// user is taken out because it is the default for both
// secret has to have its type because its defined somewhere else
// first 2 exports are for the payload and the rest are for the options


// define structure of data in payload
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
