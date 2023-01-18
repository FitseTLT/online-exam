import { Router, Request, Response } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Category } from "../../models/Category";

export const getCategory = Router();

getCategory.get(
    "/api/category/:id",
    requireAdmin,
    async (req: Request, res: Response) => {
        const category = await Category.findById(req.params.id);

        if (!category)
            throw new BadRequestError("No category found with this id");

        res.status(200).send(category);
    }
);
