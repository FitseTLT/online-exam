import { Router, Response, Request } from "express";
import { NotAuthorizedError } from "../../errors/NotAuthorizedError";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { requireAuth } from "../../middlewares/requireAuth";
import { TestReport } from "../../models/TestReport";
import { withPercentile } from "../../utils/withPercentile";

export const getTestReport = Router();

getTestReport.get(
    "/api/test-report/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const testReport = await TestReport.findById(id)
            .populate("user", ["name", "email"])
            .populate("sections.category", "name")
            .populate("exam", "name");

        if (!testReport) {
            res.status(404).send("Test report doesn't exist");
            return;
        }

        if (
            req.currentUser?.userRole === "user" &&
            req.currentUser.id !== testReport?.user.id
        ) {
            throw new NotAuthorizedError();
        }
        const totalCount = await TestReport.countDocuments({
            test: testReport.test,
        }).exec();

        const withPercentiles = withPercentile(testReport, totalCount);

        res.send(withPercentiles);
    }
);
