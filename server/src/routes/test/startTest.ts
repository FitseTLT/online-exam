import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireUser } from "../../middlewares/requireUser";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category, CategoryDoc } from "../../models/Category";
import { QuestionDifficulty, TestStatus } from "../../models/enums";
import { Exam } from "../../models/Exam";
import { Question } from "../../models/Question";
import { Test, TestDoc } from "../../models/Test";
import { TestState } from "../../models/TestState";

interface Section {
    category: CategoryDoc;
    questions: any[];
}

interface GeneratedTest {
    user: string;
    test: TestDoc;
    exam: string;
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
        } catch (e) {
            throw new Error("test id is not proper");
        }

        if (!test /*|| test.status !== TestStatus.Active*/)
            throw new BadRequestError("invalid test");

        if (test.status === TestStatus.OnProgress) {
            const testState = await TestState.findOne({ test: testId });

            if (!testState) throw new BadRequestError("invalid mmm test");
            const { testData } = testState;

            const finishingTime = new Date();
            finishingTime.setSeconds(
                testData?.attemptedOn?.getSeconds() +
                    testData?.totalAllottedTime
            );

            if (finishingTime < new Date()) {
                test.status = TestStatus.Cancelled;
                await test.save();
                throw new BadRequestError("invalid test");
            }

            res.send(testState);

            return;
        }

        const now = new Date();

        if ((test.from && test.from > now) || (test.to && test.to < now))
            throw new BadRequestError("The test has expired");

        if (req.currentUser?.email !== test.userEmail)
            throw new BadRequestError("exam not assigned to the current user");

        try {
            exam = await Exam.findById(test.exam).populate("sections.category");

            if (!exam) throw new Error();
        } catch (e) {
            throw new BadRequestError("the exam doesn't exist");
        }

        const generatedTest: GeneratedTest = {
            user: test.userEmail,
            exam: exam.name,
            test: test.id,
            attemptedOn: new Date(),
            sections: [],
            totalAllottedTime: 0,
        };

        let totalAllottedTime = 0;

        for (const section of exam.sections) {
            const category = (await Category.findById(
                section.category
            )) as CategoryDoc;

            const generatedSection: Section = { category, questions: [] };

            for (const difficulty of Object.values(QuestionDifficulty)) {
                if (!section[difficulty]) continue;

                const questions = await Question.aggregate()
                    .match({
                        difficulty,
                        category: section.category._id,
                    })
                    .sample(section[difficulty])
                    .project({
                        type: 1,
                        question: 1,
                        choices: 1,
                        difficulty: 1,
                        allottedTime: 1,
                    });

                if (questions?.length! < section[difficulty])
                    throw new BadRequestError(
                        "Not enough questions in the database"
                    );
                generatedSection.questions =
                    generatedSection.questions.concat(questions);

                totalAllottedTime = questions.reduce(
                    (prev, { allottedTime }) => prev + Number(allottedTime),
                    totalAllottedTime
                );
            }

            generatedTest.sections.push(generatedSection);
        }

        generatedTest.totalAllottedTime = totalAllottedTime;

        test.status = TestStatus.OnProgress;
        await test.save();

        const testState = TestState.build({
            testData: generatedTest,
            userAnswer: generatedTest.sections.map((section) => ({
                category: section.category.id as string,
                questions: section.questions.map((question) => ({
                    question: question._id as string,
                    userAnswer: undefined,
                })),
            })),
        });

        await testState.save();

        res.send(testState);
    }
);
