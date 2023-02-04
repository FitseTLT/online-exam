import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/NotAuthorizedError";
import { UserRole } from "../models/enums";
import { User } from "../models/User";

export const requireUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.currentUser?.userRole === UserRole.User) return next();

    throw new NotAuthorizedError();
};
