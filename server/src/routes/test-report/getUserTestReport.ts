import { Router, Response, Request } from "express";
import { Types } from "mongoose";
import { requireUser } from "../../middlewares/requireUser";
import { CategoryDoc } from "../../models/Category";
import { ExamDoc } from "../../models/Exam";
import { TestDoc } from "../../models/Test";
import { TestReport } from "../../models/TestReport";
import { UserDoc } from "../../models/User";

export interface TestReportObj {
    test: TestDoc;
    exam: ExamDoc;
    attemptedOn: Date;
    timeTaken: number;
    totalQuestions: number;
    attemptedQuestions: number;
    correct: number;
    rank: number;
    sections: {
        category: CategoryDoc;
        totalQuestions: number;
        attemptedQuestions: number;
        correct: number;
        rank: number;
    }[];
}

export const getuserTestReport = Router();

getuserTestReport.get(
    "/api/test-report/:userId",
    requireUser,
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        const testReports = await TestReport.find({
            user: userId,
        });

        const testReportsObj: TestReportObj[] = [];

        for (const testReport of testReports) {
            const rank = await TestReport.aggregate()
                .match({
                    exam: testReport.exam,
                    correct: {
                        $gt: testReport.correct,
                    },
                })
                .group({
                    _id: null,
                    count: {
                        $count: {},
                    },
                })
                .exec();

            const testReportObj: TestReportObj = {
                ...testReport.toObject(),
                rank: (rank[0]?.count || 0) + 1,
            };
            testReportsObj.push(testReportObj);

            for (const section of testReportObj.sections) {
                const rank = await TestReport.aggregate()
                    .match({
                        exam: testReportObj.exam,
                        sections: {
                            category: section.category,
                            correct: {
                                $gt: section.correct,
                            },
                        },
                    })
                    .group({
                        _id: null,
                        count: {
                            $count: {},
                        },
                    })
                    .exec();

                section.rank = (rank[0]?.count || 0) + 1;
            }
        }

        res.send(testReportsObj);
    }
);
