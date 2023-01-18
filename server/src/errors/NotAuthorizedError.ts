import { CustomError } from "./CustomError";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super([{ message: "Not Authorized" }]);

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}
