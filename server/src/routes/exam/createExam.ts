import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";
import { Exam } from "../../models/Exam";

export const createExam = Router();

createExam.post(
    "/api/exam",
    requireAdmin,
    [
        body("name")
            .isLength({ min: 2, max: 20 })
            .bail()
            .custom((name) => {
                return Exam.findOne({ name }).then((exam) => {
                    if (exam)
                        return Promise.reject(
                            "Exam with this name already exists"
                        );
                });
            }),
        body("sections")
            .isArray()
            .not()
            .isEmpty()
            .withMessage("sections cannot be empty"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const sections = [];

        for (const section of req.body.sections) {
            try {
                const categoryModel = await Category.findById(section.category);
                if (!categoryModel)
                    throw new BadRequestError("category doesn't exist");
            } catch (e) {
                throw new BadRequestError("category doesn't exist");
            }

            const { category, ...rest } = section;

            if (!rest) throw new BadRequestError("section cannot be empty");

            Object.values(rest).forEach((v) => {
                if (!Number.isInteger(Number(v)) || v! < 0)
                    throw new BadRequestError(
                        "question number cannot be less than than 0"
                    );
            });

            const totalQuestions = Object.values(rest).reduce(
                (prev: number, v) => Number(v) + prev,
                0
            );

            if (totalQuestions < 1)
                throw new BadRequestError(
                    "total question of a section cannot be zero"
                );
            const { easy, medium, hard } = rest;

            sections.push({ category, easy, medium, hard });
        }

        const exam = Exam.build({
            name: req.body.name,
            sections,
        });

        await exam.save();

        res.status(200).send(exam);
    }
);
