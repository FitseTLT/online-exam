import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";
import { QuestionDifficulty, QuestionType } from "../../models/enums";
import { Question } from "../../models/Question";

export const updateQuestion = Router();

updateQuestion.put(
    "/api/question/:id",
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
        body("answer").not().isEmpty().withMessage("answer is required"),
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
            answer,
            choices,
            isDraft,
            allottedTime,
        } = req.body;
        const id = req.params.id;

        const questionModel = await Question.findById(id);

        if (!questionModel) throw new BadRequestError("question id is wrong");

        questionModel.set({
            category,
            type,
            difficulty,
            paragraph,
            question,
            answer,
            choices,
            isDraft,
            allottedTime,
        });

        await questionModel.save();

        res.status(200).send(questionModel);
    }
);
