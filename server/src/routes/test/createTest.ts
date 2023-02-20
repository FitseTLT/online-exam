import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { TestStatus } from "../../models/enums";
import { Exam } from "../../models/Exam";
import { Test } from "../../models/Test";

export const createTest = Router();

createTest.post(
    "/api/test",
    requireAdmin,
    [
        body("userEmail").isEmail().withMessage("please enter proper email"),
        body("exam")
            .not()
            .isEmpty()
            .withMessage("exam field is required")
            .bail()
            .custom((exam) =>
                Exam.findById(exam)
                    .then((exam) => {
                        if (!exam) throw new Error("exam doesn't exist");
                    })
                    .catch((e) => {
                        throw new Error("exam doesn't exist");
                    })
            ),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { userEmail, exam, from, to } = req.body;

        const status = TestStatus.Active;

        const test = Test.build({ userEmail, exam, from, to, status });
        await test.save();

        res.send(test);
    }
);
