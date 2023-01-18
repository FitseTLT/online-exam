import { ValidationError } from "express-validator";
import { CustomError } from "./CustomError";

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(errors: ValidationError[]) {
        const messages = errors.map((error) => ({
            field: error.param,
            message: error.msg,
        }));
        super(messages);

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
