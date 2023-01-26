import { Router, Response, Request } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { requireUser } from "../../middlewares/requireUser";
import { TestReport } from "../../models/TestReport";
import { withPercentile } from "../../utils/withPercentile";

export const getAllTestReport = Router();

getAllTestReport.get(
    "/api/test-report",
    requireUser,
    async (req: Request, res: Response) => {
        const testReports = await TestReport.find();
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

        res.send(withPercentiles);
    }
);
