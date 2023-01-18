import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/NotAuthorizedError";

interface UserPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) throw new NotAuthorizedError();

    next();
};
