import { Router, Response, Request } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { Exam } from "../../models/Exam";
import { TestReport } from "../../models/TestReport";
import { User } from "../../models/User";
import { recordPerPage } from "../../utils/constants";
import { withPercentile } from "../../utils/withPercentile";

export const getAllTestReport = Router();

getAllTestReport.get(
    "/api/test-report",
    requireAuth,
    async (req: Request, res: Response) => {
        const { from, to, page = 0, user, exam } = req.query;

        const userRegex = new RegExp(user as string, "i");
        const examRegex = new RegExp(exam as string, "i");

        const userIds = [],
            examIds = [];

        if (req.currentUser?.userRole === "user") {
            userIds.push(req.currentUser.id);
        } else if (user) {
            const users = await User.find({ name: { $regex: userRegex } });
            userIds.push(...users.map((user) => user.id));
        }

        if (exam) {
            const exams = await Exam.find({ name: { $regex: examRegex } });
            examIds.push(...exams.map((exam) => exam.id));
        }

        const testReports = await TestReport.find({
            ...((user || req.currentUser?.userRole === "user") && {
                user: { $in: userIds },
            }),
            ...(exam && { exam: { $in: examIds } }),
            ...((to || from) && {
                attemptedOn: {
                    ...(to && { $lte: to }),
                    ...(from && { $gte: from }),
                },
            }),
        })
            .sort({ attemptedOn: "desc" })
            .skip((page as number) * recordPerPage)
            .limit(recordPerPage)
            .populate("user", ["name", "email"])
            .populate("sections.category", "name")
            .populate("exam", "name");

        const count = await TestReport.count({
            ...((user || req.currentUser?.userRole === "user") && {
                user: { $in: userIds },
            }),
            ...(exam && { exam: { $in: examIds } }),
            ...((to || from) && {
                attemptedOn: {
                    ...(to && { $lte: to }),
                    ...(from && { $gte: from }),
                },
            }),
        });
        const totalCounts: number[] = [];

        for (const testReport of testReports) {
            totalCounts.push(
                await TestReport.countDocuments({
                    test: testReport.test,
                }).exec()
            );
        }

        const withPercentiles = testReports.map((testReport, index) =>
            withPercentile(testReport, totalCounts[index])
        );

        res.send({ testReports: withPercentiles, count });
    }
);
