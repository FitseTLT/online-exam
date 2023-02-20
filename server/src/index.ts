require("express-async-errors");
require("dotenv").config();
require("./setup");

import { json, urlencoded } from "body-parser";
import cors from "cors";

import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { signupRouter } from "./routes/auth/signup";
import cookieSession from "cookie-session";
import { currentUser } from "./middlewares/currentUser";
import { signoutRouter } from "./routes/auth/signout";
import { signinRouter } from "./routes/auth/signin";
import { createCategory } from "./routes/category/create-category";
import { getAllCategory } from "./routes/category/get-all-category";
import { getCategory } from "./routes/category/get-category";
import { updateCategory } from "./routes/category/update-category";
import { createQuestion } from "./routes/question/create-question";
import { updateQuestion } from "./routes/question/update-question";
import { getAllQuestion } from "./routes/question/get-all-question";
import { getQuestion } from "./routes/question/get-question";
import { createExam } from "./routes/exam/createExam";
import { updateExam } from "./routes/exam/updateExam";
import { getAllExam } from "./routes/exam/getAllExam";
import { getExam } from "./routes/exam/getExam";
import { createTest } from "./routes/test/createTest";
import { getAllUsers } from "./routes/auth/getAllUsers";
import { updateTest } from "./routes/test/updateTest";
import { getAllTest } from "./routes/test/getAllTest";
import { getTest } from "./routes/test/getTest";
import { startTest } from "./routes/test/startTest";
import { submitTest } from "./routes/test/submitTest";
import { getAllTestReport } from "./routes/test-report/getAllTestReport";
import { getCurrentUser } from "./routes/auth/getCurrentUser";
import { updateProfile } from "./routes/auth/updateProfile";
import { getAllTypes } from "./routes/types/getAllTypes";
import { sendTest } from "./routes/test/sendTest";
import { getUserTests } from "./routes/test/getUserTest";
import { updateTestState } from "./routes/test/updateTestState";
import { getTestReport } from "./routes/test-report/getTestReport";

const app = express();

const COOKIE_AGE = 7 * 24 * 60 * 60 * 1000;

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"],
    })
);

app.use("/public", express.static("public"));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
    cookieSession({
        maxAge: COOKIE_AGE,
        keys: [process.env.COOKIE_SESSION_KEY!],
    })
);
app.use(currentUser);

app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(getAllUsers);
app.use(getCurrentUser);
app.use(updateProfile);

app.use(getAllTypes);

app.use(createCategory);
app.use(getAllCategory);
app.use(getCategory);
app.use(updateCategory);

app.use(createQuestion);
app.use(updateQuestion);
app.use(getAllQuestion);
app.use(getQuestion);

app.use(createExam);
app.use(updateExam);
app.use(getAllExam);
app.use(getExam);

app.use(createTest);
app.use(updateTest);
app.use(getAllTest);
app.use(getUserTests);
app.use(getTest);
app.use(startTest);
app.use(submitTest);
app.use(sendTest);
app.use(updateTestState);

app.use(getAllTestReport);
app.use(getTestReport);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
    console.log(`Listening on Port ${process.env.PORT}.`)
);
