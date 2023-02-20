import axios from "axios";
import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { Test } from "../../models/Test";

export const sendTest = Router();

sendTest.post(
    "/api/send-test",
    requireAdmin,
    [body("id").not().isEmpty()],
    validateRequest,
    async (req: Request, res: Response) => {
        let test;
        try {
            test = await Test.findById(req.body.id).populate("exam");
            if (!test) throw new BadRequestError("the test doesn't exist");
        } catch (e) {
            throw new BadRequestError("the test doesn't exist");
        }

        const { userEmail: email, exam, to, from } = test;

        try {
            const resp = await axios.post(
                "https://api.sendgrid.com/v3/mail/send",
                {
                    personalizations: [
                        {
                            to: [{ email }],
                        },
                    ],
                    subject: "Online Test",
                    from: { email: process.env.SENDER_EMAIL },
                    content: [
                        {
                            type: "text/html",
                            value: `<html><head></head><body><ul>
                            <li>Test Name : ${exam.name}</li>
                            <li>Active From : ${
                                from?.toDateString() ?? "-"
                            }</li>
                            <li>Active To : ${to?.toDateString() ?? "-"}</li>
                            <li><a href='http://localhost:3000'>Take exam</a></li>
                            </ul></body></html>`,
                        },
                    ],
                },

                {
                    headers: {
                        Authorization: `Bearer ${process.env.SEND_GRID_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            test.set({ emailSent: true });
            await test.save();
            res.status(200).send("Email successfully send");
        } catch (e: any) {
            res.status(500).send("Error occurred");
        }
    }
);
