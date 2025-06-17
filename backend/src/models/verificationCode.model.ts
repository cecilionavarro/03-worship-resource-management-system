import mongoose from "mongoose";
import VerificationCodeType from "../constants/verificationCodeTypes";

// mongoose.Types.ObjectId is the special identifier by MongoDB
export interface VerificationCodeDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    type: VerificationCodeType;
    expiresAt: Date;
    createdAt: Date;
}

// indexes userId field to make it faster search used on the collection referencing the user
const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true },
});

// using a custom name
const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
    "VerificationCode",
    verificationCodeSchema,
    "verification_codes"
);

export default VerificationCodeModel;
