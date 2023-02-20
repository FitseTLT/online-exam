import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { TestStatus } from "../../models/enums";
import { Exam } from "../../models/Exam";
import { Test } from "../../models/Test";

export const updateTest = Router();

updateTest.put(
    "/api/test/:id",
    requireAdmin,
    [
        body("userEmail").isEmail().withMessage("enter proper email"),
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
        let test;
        try {
            test = await Test.findById(req.params.id);
            if (!test) throw new Error();
        } catch (e) {
            throw new BadRequestError("the test doesn't exist");
        }

        const { userEmail, exam, from, to, status = test.status } = req.body;

        test.set({ userEmail, exam, from, to, status });
        await test.save();

        res.send(test);
    }
);
