import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Aggregate, Model, Schema } from "mongoose";
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
    easy?: any[];
    medium?: any[];
    hard?: any[];
}

interface GeneratedTest {
    user: UserDoc;
    test: TestDoc;
    attemptedOn: Date;
    sections: Section[];
    totalAllottedTime: number;
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

            if (!exam) throw new Error();
        } catch (e) {
            throw new BadRequestError("the exam doesn't exist");
        }

        const generatedTest: GeneratedTest = {
            user: test.user,
            test: test.id,
            attemptedOn: new Date(),
            sections: [],
            totalAllottedTime: 0,
        };

        let totalAllottedTime = 0;

        for (const section of exam.sections) {
            const generatedSection: Section = { category: section.category };

            for (const difficulty of Object.values(QuestionDifficulty)) {
                if (!section[difficulty]) continue;

                generatedSection[difficulty] = await Question.aggregate()
                    .match({
                        difficulty,
                        category: section.category._id,
                    })
                    .sample(section[difficulty])
                    .project({
                        question: 1,
                        choices: 1,
                        paragraph: 1,
                        id: 1,
                        difficulty: 1,
                        allottedTime: 1,
                    });

                if (
                    generatedSection?.[difficulty]?.length! <
                    section[difficulty]
                )
                    throw new BadRequestError(
                        "Not enough questions in the database"
                    );

                totalAllottedTime = generatedSection[difficulty]?.reduce(
                    (prev, { allottedTime }) => prev + Number(allottedTime),
                    totalAllottedTime
                );
            }

            generatedTest.sections.push(generatedSection);
        }

        generatedTest.totalAllottedTime = totalAllottedTime;

        test.status = TestStatus.OnProgress;
        await test.save();

        res.send(generatedTest);
    }
);
