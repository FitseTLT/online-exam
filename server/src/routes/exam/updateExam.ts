import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";
import { Exam } from "../../models/Exam";

export const updateExam = Router();

updateExam.put(
    "/api/exam/:id",
    requireAdmin,
    [body("name").isLength({ min: 2, max: 20 }), body("sections").isArray()],
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
                if (!Number.isInteger(v) || v! <= 0)
                    throw new BadRequestError(
                        "question number should be a number greater than 0"
                    );
            });

            const { easy, medium, hard } = rest;

            sections.push({ category, easy, medium, hard });
        }
        let exam;

        try {
            exam = await Exam.findById(req.params.id);
        } catch (e) {}

        if (!exam) throw new BadRequestError("The exam doesn't exist.");

        exam.set({
            name: req.body.name,
            sections,
        });
        await exam.save();

        res.status(200).send(exam);
    }
);
