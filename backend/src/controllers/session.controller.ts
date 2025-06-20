import { Request, Response } from "express";
import SessionModel from "../models/session.model";
import { NOT_FOUND, OK } from "../constants/http";
import z from "zod";
import appAssert from "../utils/appAssert";

export const getSessionsHandler = async (req: Request, res: Response) => {
    const sessions = await SessionModel.find(
        {
            userId: req.userId,
            expiresAt: { $gt: new Date() },
        },
        {
            _id: 1,
            userAgent: 1,
            createdAt: 1,
        },
        {
            sort: { createdAt: -1 },
        }
    );

    res.status(OK).json(
        sessions.map((session) => ({
            ...session.toObject(),
            ...(session.id === req.sessionId && {
                isCurrent: true,
            }),
        }))
    );
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
    const sessionId = z.string().parse(req.params.id);
    const deleted = await SessionModel.findOneAndDelete({
        _id: sessionId,
        userId: req.userId,
    })
    appAssert(deleted, NOT_FOUND, "Session not found");
    res.status(OK).json({
        message: "Session removed",
    })
}