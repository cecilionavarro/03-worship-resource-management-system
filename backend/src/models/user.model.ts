import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(val: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

// we are using function since we have to use 'this'
userSchema.pre("save", async function (next) {
    // if password field hasn't changed, skip hashing it again
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await hashValue(this.password);
    next();
});

userSchema.methods.comparePassword = async function (val: string) {
    return compareValue(val, this.password)
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;