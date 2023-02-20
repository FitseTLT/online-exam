import { Document, model, Model, Schema, Types } from "mongoose";
import { CategoryDoc } from "./Category";
import { TestDoc } from "./Test";

interface Question {
    question: string;
    choices?: string[];
    _id: string;
    difficulty: string;
    type: string;
    userAnswer?: string;
}

interface Section {
    category: CategoryDoc;
    questions: Question[];
}

interface TestStateAttrs {
    testData: {
        test: TestDoc;
        exam: string;
        sections: Section[];
        totalAllottedTime: number;
        attemptedOn: Date;
    };
    userAnswer: {
        category: string;
        questions: { question: string; userAnswer: string | undefined }[];
    }[];
}

export interface TestStateDoc extends Document {
    testData: {
        test: string;
        exam: string;
        attemptedOn: Date;
        totalAllottedTime: number;
        sections: Section[];
    };
}

interface TestStateModel extends Model<TestStateDoc> {
    build(attrs: TestStateAttrs): TestStateDoc;
}

const testStateSchema = new Schema(
    {
        testData: {
            test: {
                required: true,
                type: String,
            },
            attemptedOn: {
                required: true,
                type: Date,
            },
            exam: { required: true, type: String },
            totalAllottedTime: { required: true, type: Number },
            sections: [
                {
                    category: {
                        type: Types.ObjectId,
                        ref: "Category",
                        required: true,
                    },
                    questions: [
                        {
                            question: String,
                            choices: [String],
                            _id: String,
                            difficulty: String,
                            type: { type: String },
                            allottedTime: Number,
                        },
                    ],
                },
            ],
        },
        userAnswer: [
            {
                category: String,
                questions: [{ question: String, userAnswer: String }],
            },
        ],
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

testStateSchema.statics.build = (attrs: TestStateAttrs) => {
    return new TestState(attrs);
};

export const TestState = model<TestStateDoc, TestStateModel>(
    "TestState",
    testStateSchema
);
