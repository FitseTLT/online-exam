import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Category } from "../../models/Category";

export const updateCategory = Router();

updateCategory.put(
    "/api/category/:id",
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
            .isLength({ min: 2, max: 20 })
            .withMessage("Code should be 2 - 20 characters."),
    ],
    async (req: Request, res: Response) => {
        const category = await Category.findById(req.params.id);

        if (!category)
            throw new BadRequestError("No category found with this id");

        const { name, code } = req.body;

        category.set({ name, code });

        await category.save();

        res.status(200).send(category);
    }
);
