import { Router, Request, Response } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Question } from "../../models/Question";

export const getAllQuestion = Router();

getAllQuestion.get(
    "/api/question",
    requireAdmin,
    async (req: Request, res: Response) => {
        const questionModel = await Question.find();

        res.status(200).send(questionModel);
    }
);
