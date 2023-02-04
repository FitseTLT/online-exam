import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/User";
import { Password } from "../../utils/password";
import jwt from "jsonwebtoken";
import { WrongCredentialError } from "../../errors/WrongCredentialError";

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

        if (!user)
            throw new WrongCredentialError({
                field: "email",
                message: "Wrong email",
            });
        const passwordCorrect = await Password.compare(user.password, password);

        if (!passwordCorrect)
            throw new WrongCredentialError({
                field: "password",
                message: "Wrong password",
            });

        const cookie = jwt.sign(
            {
                id: user.id,
                userRole: user.role,
            },
            process.env.JWT_KEY!
        );

        req.session = { jwt: cookie };

        res.status(200).send({});
    }
);
