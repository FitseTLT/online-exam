import { Document, model, Model, Schema, Types } from "mongoose";
import { calculatePercentile } from "../utils/calculatePercentile";
import { CategoryDoc } from "./Category";
import { ExamDoc } from "./Exam";
import { TestDoc } from "./Test";
import { UserDoc } from "./User";

interface TestReportAttrs {
    user: Types.ObjectId;
    test: TestDoc;
    exam: ExamDoc;
    attemptedOn: Date;
    timeTaken: number;
    totalQuestions: number;
    attemptedQuestions: number;
    correct: number;
    sections: {
        category: CategoryDoc;
        totalQuestions: number;
        attemptedQuestions: number;
        correct: number;
    }[];
}

export interface TestReportDoc extends Document {
    user: UserDoc;
    test: TestDoc;
    exam: ExamDoc;
    attemptedOn: Date;
    timeTaken: number;
    totalQuestions: number;
    attemptedQuestions: number;
    correct: number;
    rank: number;
    sections: {
        category: Types.ObjectId;
        totalQuestions: number;
        attemptedQuestions: number;
        correct: number;
        rank: number;
        percentile?: number;
    }[];
}

interface TestReportModel extends Model<TestReportDoc> {
    build(attrs: TestReportAttrs): TestReportDoc;
}

const testReportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    attemptedOn: {
        type: Date,
        required: true,
    },
    timeTaken: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    attemptedQuestions: {
        type: Number,
        required: true,
    },
    correct: {
        type: Number,
        required: true,
    },
    rank: Number,
    percentile: Number,
    sections: [
        {
            category: {
                type: Schema.Types.ObjectId,
                ref: "Category",
                required: true,
            },
            totalQuestions: {
                type: Number,
                required: true,
            },
            attemptedQuestions: {
                type: Number,
                required: true,
            },
            correct: {
                type: Number,
                required: true,
            },
            rank: Number,
            percentile: Number,
        },
    ],
});

testReportSchema.pre("save", async function (next) {
    if (this.isNew) {
        const exam = this.get("exam");
        const count = (await TestReport.countDocuments({ exam }).exec()) + 1;

        //rank and percentile  calculation for total result
        // no of test reports with better result
        const noBetterResults = await TestReport.aggregate()
            .match({
                exam,
                correct: {
                    $gt: this.get("correct"),
                },
            })
            .count("count")
            .exec();

        const rank = (noBetterResults[0]?.count || 0) + 1;

        this.set("rank", rank);
        const percentile = calculatePercentile(rank, count);

        this.set("percentile", percentile);

        const sections = this.get("sections");

        for (const section of sections) {
            const { correct, category } = section;

            //rank and percentile calculation for each sections
            // no of test reports with better result
            const noBetterResults = await TestReport.aggregate()
                .match({
                    exam: this.get("exam"),
                    sections: {
                        $elemMatch: {
                            category: category,
                            correct: {
                                $gt: correct,
                            },
                        },
                    },
                })
                .count("count")
                .exec();

            const rank = (noBetterResults[0]?.count || 0) + 1;
            section.rank = rank;
            section.percentile = calculatePercentile(rank, count);
        }
    }

    next();
});

testReportSchema.pre("save", async function (next) {
    if (this.isNew) {
        const correct = this.get("correct");
        const exam = this.get("exam");
        const count = (await TestReport.countDocuments({ exam }).exec()) + 1;

        const testReports = await TestReport.find({
            exam,
        });

        const sections = this.get("sections");

        for (const testReport of testReports) {
            if (testReport.id === this.id) continue;

            if (testReport.correct < correct)
                testReport.set("rank", testReport.rank + 1);

            const percentile = calculatePercentile(testReport.rank, count);

            testReport.set("percentile", percentile);

            for (const section of sections) {
                const { correct, category } = section;

                testReport.sections.forEach((section) => {
                    if (
                        section.category.toString() === category.toString() &&
                        section.correct < correct
                    )
                        section.rank = section.rank + 1;

                    section.percentile = calculatePercentile(
                        section.rank,
                        count
                    );
                });
            }
            await testReport.save();
        }
    }

    next();
});

testReportSchema.statics.build = (attrs: TestReportAttrs) => {
    return new TestReport(attrs);
};

export const TestReport = model<TestReportDoc, TestReportModel>(
    "TestReport",
    testReportSchema
);
