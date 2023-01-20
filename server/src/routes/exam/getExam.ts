import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";
import { Exam } from "../../models/Exam";

export const getExam = Router();

getExam.get(
    "/api/exam/:id",
    requireAdmin,
    async (req: Request, res: Response) => {
        try {
            const exam = await Exam.findById(req.params.id);
            res.status(200).send(exam);
        } catch (e) {
            throw new BadRequestError("The exam doesn't exist");
        }
    }
);
