import { Router, Response, Request } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { Test } from "../../models/Test";

export const getTest = Router();

getTest.get(
    "/api/test/:id",
    requireAdmin,
    async (req: Request, res: Response) => {
        let test;
        try {
            test = await Test.findById(req.params.id);
        } catch (e) {
            throw new BadRequestError("the test doesn't exist");
        }

        res.send(test);
    }
);
