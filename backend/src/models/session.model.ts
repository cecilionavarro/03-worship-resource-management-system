import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

// This value will be an ObjectId.
export interface SessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId; // mongoose id like ex. "665e0c9394f2eafbcd123456"
    userAgent?: string; //device ex ios
    createdAt: Date;
    expiresAt: Date;
}

// This field should be stored as an ObjectId in MongoDB - mongoose.Schema...
const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        index: true,
    },
    userAgent: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, default: thirtyDaysFromNow },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
