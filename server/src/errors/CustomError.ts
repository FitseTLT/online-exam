export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(public messages: { message: string; field?: string }[]) {
        super();
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
