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

const app = express();

app.use(json());
app.use(
    cookeSession({
        keys: [process.env.COOKIE_SESSION_KEY!],
    })
);
app.use(currentUser);

app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);

app.use(errorHandler);

app.listen(3000, () => console.log("Listening on Port 3000."));
