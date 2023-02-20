import { Router, Response, Request } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Category } from "../../models/Category";
import { QuestionDifficulty, QuestionType } from "../../models/enums";

export const getAllTypes = Router();

getAllTypes.get(
    "/api/types",
    requireAdmin,
    async (req: Request, res: Response) => {
        const categories = await Category.find();

        res.send({
            categories,
            questionTypes: Object.entries(QuestionType),
            questionDifficulty: Object.entries(QuestionDifficulty),
        });
    }
);
