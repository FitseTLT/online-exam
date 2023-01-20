import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Category } from "../../models/Category";
import { Exam } from "../../models/Exam";

export const getAllExam = Router();

getAllExam.get(
    "/api/exam",
    requireAdmin,
    async (req: Request, res: Response) => {
        const exams = await Exam.find();

        res.status(200).send(exams);
    }
);
