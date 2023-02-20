import { Router, Request, Response } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import { User } from "../../models/User";

export const getCurrentUser = Router();

getCurrentUser.get("/api/current-user", async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser?.id);

    if (!user) throw new BadRequestError("user doesn't exist");

    res.send({
        name: user.name,
        avatar: user.avatar,
        userRole: user.role,
        email: user.email,
    });
});
