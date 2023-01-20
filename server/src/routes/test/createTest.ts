import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { TestStatus, UserRole } from "../../models/enums";
import { Exam } from "../../models/Exam";
import { Test } from "../../models/Test";
import { User } from "../../models/User";

export const createTest = Router();

createTest.post(
    "/api/test",
    requireAdmin,
    [
        body("user")
            .not()
            .isEmpty()
            .withMessage("user field is required")
            .bail()
            .custom((user) =>
                User.findById(user)
                    .then((user) => {
                        if (!user || user.role !== UserRole.User)
                            throw new Error("user doesn't exist");
                    })
                    .catch((e) => {
                        throw new Error("enter proper user id");
                    })
            ),
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
        body("from")
            .if(body("from").exists())
            .isDate()
            .withMessage("from field should be of date type"),
        body("to")
            .if(body("to").exists())
            .isDate()
            .withMessage("to field should be of date type"),
        body("status").isIn(Object.values(TestStatus)),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { user, exam, from, to, status } = req.body;

        const test = Test.build({ user, exam, from, to, status });
        await test.save();

        res.send(test);
    }
);
