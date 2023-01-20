import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/User";
import { Password } from "../../utils/password";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";

export const getAllUsers = Router();

getAllUsers.get(
    "/api/users",
    requireAdmin,
    async (req: Request, res: Response) => {
        const users = await User.find();

        res.status(200).send(users);
    }
);
