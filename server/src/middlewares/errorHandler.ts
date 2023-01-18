import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof CustomError)
        return res.status(error.statusCode).send(error.messages);

    res.status(400).send([{ message: error.message }]);
};
