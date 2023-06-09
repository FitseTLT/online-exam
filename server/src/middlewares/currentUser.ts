import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserRole } from "../models/enums";

interface UserPayload {
    id: string;
    userRole: UserRole;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (req: Request, _: Response, next: NextFunction) => {
    if (!req.session?.jwt) return next();
    try {
        const payload = verify(
            req.session?.jwt,
            process.env.JWT_KEY!
        ) as UserPayload;
        req.currentUser = payload;
    } catch (e) {
        console.log(e);
    }
    next();
};
