import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/User";
import { Password } from "../../utils/password";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors/BadRequestError";

export const signinRouter = Router();

signinRouter.post(
    "/api/signin",
    [
        body("email").isEmail().withMessage("Email should be a proper email"),
        body("password").not().isEmpty().withMessage("Password is required"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) throw new BadRequestError("Invalid Credentials");

        const cookie = jwt.sign({ id: user.id }, process.env.JWT_KEY!);

        req.session = { jwt: cookie };

        res.status(200).send({});
    }
);
