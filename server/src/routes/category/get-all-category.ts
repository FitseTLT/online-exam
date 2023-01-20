import { Router, Request, Response } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Category } from "../../models/Category";

export const getAllCategory = Router();

getAllCategory.get(
    "/api/categories",
    requireAdmin,
    async (req: Request, res: Response) => {
        const categories = await Category.find();

        res.status(200).send(categories);
    }
);
