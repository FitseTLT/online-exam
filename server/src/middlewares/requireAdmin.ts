import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/NotAuthorizedError";
import { UserRole } from "../models/enums";
import { User } from "../models/User";

export const requireAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.currentUser?.id;

    const user = await User.findById(userId);

    if (user?.role === UserRole.Administrator) return next();

    throw new NotAuthorizedError();
};
