import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";
import { QuestionDifficulty, QuestionType } from "../../models/enums";
import { Question } from "../../models/Question";

export const createQuestion = Router();

createQuestion.post(
    "/api/question",
    requireAdmin,
    [
        body("category").custom((categoryId) => {
            return Category.findById(categoryId)
                .then((category) => {
                    if (!category)
                        return Promise.reject("please enter proper category");
                })
                .catch((e) => Promise.reject("please enter proper category"));
        }),
        body("type").custom((type) => {
            if (!Object.values(QuestionType).includes(type))
                throw new Error("please enter proper type value");
            return true;
        }),
        body("difficulty").custom((Difficulty) => {
            if (!Object.values(QuestionDifficulty).includes(Difficulty))
                throw new Error("please enter proper Difficulty value");
            return true;
        }),
        body("question").not().isEmpty().withMessage("question is required"),
        body("choices")
            .if(body("type").equals(QuestionType.MCQ))
            .not()
            .isEmpty()
            .if(body("choices").exists())
            .isArray({ min: 2 }),
        body("isDraft").isBoolean(),
        body("allottedTime").if(body("allottedTime").exists()).isInt(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            category,
            type,
            difficulty,
            paragraph,
            question,
            choices,
            isDraft,
            allottedTime,
        } = req.body;

        const questionModel = Question.build({
            category,
            type,
            difficulty,
            paragraph,
            question,
            choices,
            isDraft,
            allottedTime,
        });

        await questionModel.save();

        res.status(200).send(questionModel);
    }
);
