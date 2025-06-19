import { Request, Response } from "express";
import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";

export const getUserHandler = async (req: Request, res: Response) => {
    // request will always have a userId because of middleware no need to validate
    const user = await UserModel.findById(req.userId);
    appAssert(user, NOT_FOUND, "User Not found");
    res.status(OK).json(user.omitPassword());
};
