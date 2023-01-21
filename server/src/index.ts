require("express-async-errors");
require("dotenv").config();
require("./setup");

import { json } from "body-parser";

import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { signupRouter } from "./routes/auth/signup";
import cookeSession from "cookie-session";
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

const app = express();

const COOKIE_AGE = 7 * 24 * 60 * 60 * 1000;

app.use(json());
app.use(
    cookeSession({
        maxAge: COOKIE_AGE,
        keys: [process.env.COOKIE_SESSION_KEY!],
    })
);
app.use(currentUser);

app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(getAllUsers);

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
app.use(getTest);
app.use(startTest);

app.use(errorHandler);

app.listen(3000, () => console.log("Listening on Port 3000."));
