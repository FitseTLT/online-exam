import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors/BadRequestError";

const signupRouter = Router();

signupRouter.post(
    "/api/signup",
    [
        body("name").not().isEmpty().withMessage("Name is required"),
        body("email")
            .isEmail()
            .withMessage("Give a proper email.")
            .custom((email) => {
                return User.findOne({ email }).then((user) => {
                    if (user) return Promise.reject("Email already exists");
                });
            }),
        body("password")
            .trim()
            .custom((password) => {
                const passwordRegex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/;

                if (!passwordRegex.test(password))
                    throw new Error(
                        "Password should be between 8 and 20 characters with at least one uppercase, lowercase letters and digit"
                    );

                return true;
            }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        const user = User.build({
            name,
            email,
            password,
        });

        await user.save();

        const userJWT = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_KEY!
        );

        req.session = { jwt: userJWT };
        res.status(200).send(user);
    }
);

export { signupRouter };
