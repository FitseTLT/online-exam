import { Request, Response, Router } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Exam } from "../../models/Exam";
import { recordPerPage } from "../../utils/constants";

export const getAllExam = Router();

getAllExam.get(
    "/api/exam",
    requireAdmin,
    async (req: Request, res: Response) => {
        const searchRegEX = new RegExp((req.query.name as string) || "", "i");
        const { page = 0 } = req.query;

        const exams = await Exam.find({
            name: {
                $regex: searchRegEX,
            },
        })
            .skip(Number(page) * recordPerPage)
            .limit(recordPerPage);

        const count = await Exam.count({
            name: {
                $regex: searchRegEX,
            },
        });

        res.status(200).send({ exams, count });
    }
);
