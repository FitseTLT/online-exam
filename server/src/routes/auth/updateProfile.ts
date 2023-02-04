import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { User } from "../../models/User";
import { Password } from "../../utils/password";
import multer from "multer";
import { WrongCredentialError } from "../../errors/WrongCredentialError";
import { BadRequestError } from "../../errors/BadRequestError";
import { v4 as uuid } from "uuid";

export const updateProfile = Router();

const AVATAR_DIR = "./public/user-avatars";

const storage = multer.diskStorage({
    destination: AVATAR_DIR,
    filename: (_, file, cb) => {
        const filename = file.originalname.toLowerCase().split(" ").join("-");
        const fullfilename = uuid() + "-" + filename;
        cb(null, fullfilename);
    },
});

const upload = multer({
    storage,
    fileFilter: (_, file, cb) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png"
        )
            cb(null, true);
        else {
            cb(null, false);
            return cb(
                new Error("Avatar can only be in png, jpg or jpeg format.")
            );
        }
    },
});

updateProfile.put(
    "/api/profile",
    upload.single("avatar"),

    [
        body("name").not().isEmpty().withMessage("Name is required"),
        body("password").not().isEmpty().withMessage("Password is required"),
        body("new_password")
            .if((value: string) => value !== "")
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
        body("confirm_password")
            .custom((value, { req }) => req.body.new_password === value)
            .withMessage("New and confirm password are not equal"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { password, name, new_password, avatar } = req.body;

        const user = await User.findById(req.currentUser?.id);

        if (!user) throw new BadRequestError("User doesn't exist");

        const passwordCorrect = await Password.compare(user.password, password);

        if (!passwordCorrect)
            throw new WrongCredentialError({
                field: "password",
                message: "Wrong password",
            });

        user.set("name", name);

        if (new_password) user.set("password", new_password);

        if (req.file?.filename) {
            user.set(
                "avatar",
                AVATAR_DIR.replace("./", "/") + "/" + req.file?.filename
            );
        }

        try {
            user.save();
        } catch (e) {
            throw new Error("User updating not successfull");
        }

        res.status(200).send(user);
    }
);
