import { TestReportDoc } from "../models/TestReport";
import { calculatePercentile } from "./calculatePercentile";

export const withPercentile = (
    testReport: TestReportDoc,
    totalCount: number
) => {
    const sections = testReport.sections.map(
        ({ category, totalQuestions, attemptedQuestions, correct, rank }) => ({
            category,
            totalQuestions,
            attemptedQuestions,
            correct,
            rank,
            percentile: calculatePercentile(rank, totalCount),
        })
    );

    return {
        ...testReport.toObject(),
        percentile: calculatePercentile(testReport.rank, totalCount),
        sections,
    };
};
