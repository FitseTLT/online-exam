import { Router, Response, Request } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Test } from "../../models/Test";

export const getAllTest = Router();

getAllTest.get(
    "/api/test",
    requireAdmin,
    async (req: Request, res: Response) => {
        const tests = await Test.find();

        res.send(tests);
    }
);
