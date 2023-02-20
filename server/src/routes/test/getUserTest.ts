import { Router, Response, Request } from "express";
import { requireUser } from "../../middlewares/requireUser";
import { TestStatus } from "../../models/enums";
import { Test } from "../../models/Test";

export const getUserTests = Router();

getUserTests.get(
    "/api/test/user",
    requireUser,
    async (req: Request, res: Response) => {
        const userEmail = req.currentUser?.email;

        const tests = await Test.find({
            userEmail,
            status: TestStatus.Active,
        }).populate("exam");

        const count = await Test.count({ userEmail });

        res.send({ tests, count });
    }
);
