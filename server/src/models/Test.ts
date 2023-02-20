import { Document, model, Model, Schema } from "mongoose";
import { TestStatus } from "./enums";
import { ExamDoc } from "./Exam";
import { TestReportDoc } from "./TestReport";

interface TestAttrs {
    userEmail: string;
    exam: ExamDoc;
    from?: Date;
    to?: Date;
    status: TestStatus;
}

export interface TestDoc extends Document {
    userEmail: string;
    exam: ExamDoc;
    from: Date;
    to: Date;
    status: TestStatus;
    testReport: TestReportDoc;
    emailSent: boolean;
}

interface TestModel extends Model<TestDoc> {
    build(attrs: TestAttrs): TestDoc;
}

const testSchema = new Schema(
    {
        userEmail: {
            type: String,
            required: true,
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        from: {
            type: Date,
        },
        to: {
            type: Date,
        },
        status: {
            type: String,
            enum: Object.values(TestStatus),
            required: true,
        },
        testReport: {
            type: Schema.Types.ObjectId,
            ref: "TestReport",
        },
        emailSent: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

testSchema.statics.build = (attrs: TestAttrs) => {
    return new Test(attrs);
};

export const Test = model<TestDoc, TestModel>("Test", testSchema);
