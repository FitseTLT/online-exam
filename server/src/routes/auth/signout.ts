import { Router, Request, Response } from "express";
import { requireAuth } from "../../middlewares/requireAuth";

export const signoutRouter = Router();

signoutRouter.post(
    "/api/signout",
    requireAuth,
    (req: Request, res: Response) => {
        req.session = null;
        res.status(200).send({});
    }
);
