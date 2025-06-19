import mongoose from "mongoose";

declare global {
    namespace Express {
        interface Request {
            userId: UserDocument["_id"];
            sessionId: SessionDocument["_id"];
        }
    }
}
export {};
