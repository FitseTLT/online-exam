import { Router, Response, Request } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireUser } from "../../middlewares/requireUser";
import { TestState } from "../../models/TestState";

export const updateTestState = Router();

updateTestState.put(
    "/api/test-state/:id",
    requireUser,
    async (req: Request, res: Response) => {
        let testState;
        try {
            testState = await TestState.findOne({ test: req.params.id });
            if (!testState) throw new Error("No test recorded");
        } catch (e) {
            throw new BadRequestError("the test doesn't exist");
        }

        testState.set(req.body);
        await testState.save();

        res.send(testState);
    }
);
