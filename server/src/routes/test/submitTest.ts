import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Types } from "mongoose";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireUser } from "../../middlewares/requireUser";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category, CategoryDoc } from "../../models/Category";
import { TestStatus } from "../../models/enums";
import { Question } from "../../models/Question";
import { Test } from "../../models/Test";
import { TestReport } from "../../models/TestReport";

interface Section {
    category: CategoryDoc;
    totalQuestions: number;
    attemptedQuestions: number;
    correct: number;
}

export const submitTest = Router();

submitTest.post(
    "/api/test/submit",
    requireUser,
    [
        body("test").not().isEmpty().withMessage("test is required"),
        body("attemptedOn")
            .not()
            .isEmpty()
            .withMessage("attempted on should be date"),
        body("timeTaken").isInt(),
        body("sections").isArray(),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { test: testId, attemptedOn, timeTaken, sections } = req.body;

        let test;

        try {
            test = await Test.findById(testId);

            if (!test) throw new Error();

            if (test.userEmail !== req.currentUser?.email)
                throw new BadRequestError(
                    "test not assigned to the current user"
                );
        } catch (e) {
            throw new BadRequestError("test value not proper");
        }

        const reportSections: Section[] = [];
        const total = { attemptedQuestions: 0, totalQuestions: 0, correct: 0 };

        for (const section of sections) {
            const { category: categoryId, questions } = section;

            let category,
                totalQuestions = questions.length,
                attemptedQuestions = 0,
                correct = 0;

            total.totalQuestions += totalQuestions;

            try {
                category = await Category.findById(categoryId);

                if (!category) throw new Error();
            } catch (e) {
                throw new BadRequestError("category value not proper");
            }

            for (const { question: questionId, userAnswer } of questions) {
                let question;

                try {
                    question = await Question.findById(questionId);

                    if (!question) throw new Error();
                } catch (e) {
                    throw new BadRequestError("question value not proper");
                }

                if (userAnswer) {
                    attemptedQuestions++;
                    total.attemptedQuestions++;
                    if (userAnswer === question.answer) {
                        total.correct++;
                        correct++;
                    }
                }
            }

            reportSections.push({
                category: category.id,
                totalQuestions,
                attemptedQuestions,
                correct,
            });
        }

        const testReport = TestReport.build({
            user: new Types.ObjectId(req.currentUser?.id),
            test: test.id,
            exam: test.exam,
            attemptedOn,
            timeTaken,
            ...total,
            sections: reportSections,
        });

        await testReport.save();

        test.testReport = testReport;

        test.status = TestStatus.Submitted;

        await test.save();

        res.send(testReport);
    }
);
