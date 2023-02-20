import { Router, Request, Response } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { QuestionDifficulty, QuestionType } from "../../models/enums";
import { Question } from "../../models/Question";
import { recordPerPage } from "../../utils/constants";

export const getAllQuestion = Router();

getAllQuestion.get(
    "/api/question",
    requireAdmin,
    async (req: Request, res: Response) => {
        const { category, type, difficulty } = req.query;

        const queryQuestion = req.query?.question?.toString() ?? "";
        const page = Number(req.query?.page ?? 0);

        const questionModels = await Question.find({
            question: {
                $regex: new RegExp(queryQuestion, "i"),
            },
            ...(category && { category }),
            ...(type && { type }),
            ...(difficulty && { difficulty }),
        })
            .skip(page * recordPerPage)
            .limit(recordPerPage)
            .populate("category", "name -_id");

        const count = await Question.count({
            question: {
                $regex: new RegExp(queryQuestion, "i"),
            },
            ...(category && { category }),
            ...(type && { type }),
            ...(difficulty && { difficulty }),
        });

        const questions = questionModels.map((question) => question.toObject());

        res.status(200).send({
            count,
            questions: questions.map(
                ({ category, difficulty, type, ...rest }) => ({
                    ...rest,
                    category: category.name,
                    type: Object.entries(QuestionType).find(
                        ([label, key]) => key === type
                    )?.[0],
                    difficulty: Object.entries(QuestionDifficulty).find(
                        ([label, key]) => key === difficulty
                    )?.[0],
                })
            ),
        });
    }
);
