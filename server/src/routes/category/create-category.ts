import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { RequestValidationError } from "../../errors/RequestValidationError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";

export const createCategory = Router();

createCategory.post(
    "/api/category",
    requireAdmin,
    [
        body("name")
            .not()
            .isEmpty()
            .custom((name) => {
                if (name.length < 2 || name.length > 20)
                    throw new BadRequestError(
                        "Name length should be from 2 - 20 characters"
                    );

                return Category.findOne({ name }).then((v) => {
                    if (v)
                        return Promise.reject(
                            "Other category exist with this name"
                        );
                });
            }),
        body("code")
            .not()
            .isEmpty()
            .custom((code) => {
                if (code.length < 2 || code.length > 20)
                    return Promise.reject("Code should be 2 - 20 characters");

                return Category.findOne({ code }).then((v) => {
                    if (v)
                        return Promise.reject(
                            "Other category exist with this code"
                        );
                });
            }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, code } = req.body;

        const category = Category.build({
            name,
            code,
        });

        await category.save();

        res.status(200).send(category);
    }
);
