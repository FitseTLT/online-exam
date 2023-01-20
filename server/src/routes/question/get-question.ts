import { Router, Request, Response } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Question } from "../../models/Question";

export const getQuestion = Router();

getQuestion.get(
    "/api/question/:id",
    requireAdmin,
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const questionModel = await Question.findById(id);

        if (!questionModel) throw new BadRequestError("question id is wrong");

        res.status(200).send(questionModel);
    }
);
