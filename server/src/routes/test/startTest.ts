import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Schema } from "mongoose";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireUser } from "../../middlewares/requireUser";
import { validateRequest } from "../../middlewares/validateRequest";
import { CategoryDoc } from "../../models/Category";
import { QuestionDifficulty, TestStatus } from "../../models/enums";
import { Exam } from "../../models/Exam";
import { Question, QuestionDoc } from "../../models/Question";
import { Test, TestDoc } from "../../models/Test";
import { UserDoc } from "../../models/User";
import { generateRandomly } from "../../utils/generateRandomly";

interface Section {
    category: CategoryDoc;
    easy?: QuestionDoc[];
    medium?: QuestionDoc[];
    hard?: QuestionDoc[];
}

interface GeneratedTest {
    user: UserDoc;
    test: TestDoc;
    attemptedOn: Date;
    sections: Section[];
    allottedTime: number;
}

export const startTest = Router();

startTest.post(
    "/api/test/start",
    requireUser,
    [body("test").notEmpty().withMessage("test field is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        const { test: testId } = req.body;
        let test, exam;

        try {
            test = await Test.findById(testId);

            if (
                !test ||
                test.status !== TestStatus.Active ||
                test.user.toString() !== req.currentUser?.id
            )
                throw new Error();
        } catch (e) {
            throw new Error("test id is not proper");
        }

        try {
            exam = await Exam.findById(test.exam).populate("sections.category");
            console.log(exam);
            if (!exam) throw new Error();
        } catch (e) {
            throw new BadRequestError("the exam doesn't exist");
        }

        const allQuestions = await Question.find({ isDraft: false });

        // calculate the number of question for each difficulty
        const generatedTest: GeneratedTest = {
            user: test.user,
            test: test.id,
            attemptedOn: new Date(),
            sections: [],
            allottedTime: 0,
        };

        exam.sections.forEach((section) => {
            const generatedSection: Section = { category: section.category };

            const questionsInCategory = allQuestions.filter(
                (question) =>
                    question.category.toString() === section.category.id
            );

            Object.values(QuestionDifficulty).forEach((difficulty) => {
                const questionsOfDifficulty = questionsInCategory.filter(
                    (question) => question.difficulty === difficulty
                );
                const noQuestions = section[difficulty];

                if (noQuestions > questionsOfDifficulty.length)
                    throw new BadRequestError(
                        "Not enough questions in the database"
                    );

                generatedSection[difficulty] = generateRandomly(
                    questionsOfDifficulty,
                    noQuestions
                );
            });

            generatedTest.sections.push(generatedSection);
        });

        //allotted Time

        let allottedTime = 0;

        generatedTest.sections.forEach((section) => {
            Object.values(QuestionDifficulty).forEach((difficulty) => {
                section[difficulty]?.forEach((question) => {
                    allottedTime += question.allottedTime;
                });
            });
        });

        generatedTest.allottedTime = allottedTime;

        test.status = TestStatus.OnProgress;
        await test.save();

        res.send(generatedTest);
    }
);
