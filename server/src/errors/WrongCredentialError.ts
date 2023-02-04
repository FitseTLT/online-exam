import { ValidationError } from "express-validator";
import { CustomError } from "./CustomError";

export class WrongCredentialError extends CustomError {
    statusCode = 400;

    constructor(error: { field: string; message: string }) {
        super([error]);

        Object.setPrototypeOf(this, WrongCredentialError.prototype);
    }
}
