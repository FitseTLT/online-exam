import { Document, model, Model, Schema } from "mongoose";
import { TestStatus } from "./enums";
import { ExamDoc } from "./Exam";
import { TestReportDoc } from "./TestReport";
import { UserDoc } from "./User";

interface TestAttrs {
    user: UserDoc;
    exam: ExamDoc;
    from: Date;
    to: Date;
    status: TestStatus;
    testReport: TestReportDoc;
}

interface TestDoc extends Document {
    user: UserDoc;
    exam: ExamDoc;
    from: Date;
    to: Date;
    status: TestStatus;
}

interface TestModel extends Model<TestDoc> {
    build(attrs: TestAttrs): TestDoc;
}

const testSchema = new Schema(
    {
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
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
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
