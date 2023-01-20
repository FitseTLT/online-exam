import { Document, model, Model, Schema } from "mongoose";
import { CategoryDoc } from "./Category";
import { TestDoc } from "./Test";
import { UserDoc } from "./User";

interface TestReportAttrs {
    user: UserDoc;
    test: TestDoc;
    attemptedOn: Date;
    timeTaken: number;
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
    attemptedOn: Date;
    timeTaken: number;
    sections: {
        category: CategoryDoc;
        totalQuestions: number;
        attemptedQuestions: number;
        correct: number;
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
        },
    ],
});

testReportSchema.statics.build = (attrs: TestReportAttrs) => {
    return new TestReport(attrs);
};

export const TestReport = model<TestReportDoc, TestReportModel>(
    "TestReport",
    testReportSchema
);
