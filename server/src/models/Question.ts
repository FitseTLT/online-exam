import { Document, model, Model, Schema } from "mongoose";
import { CategoryDoc } from "./Category";
import { QuestionDifficulty, QuestionType } from "./enums";

interface QuestionAttrs {
    category: CategoryDoc;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    paragraph?: string;
    question: string;
    choices?: string[];
    isDraft: boolean;
    allottedTime?: number;
}

export interface QuestionDoc extends Document {
    category: CategoryDoc;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    paragraph?: string;
    question: string;
    choices?: string[];
    isDraft: boolean;
    allottedTime: number;
}

interface QuestionModel extends Model<QuestionDoc> {
    build(attrs: QuestionAttrs): QuestionDoc;
}

const questionSchema = new Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(QuestionType),
        },
        difficulty: {
            type: String,
            required: true,
            enum: Object.values(QuestionDifficulty),
        },
        paragraph: String,
        question: {
            type: String,
            required: true,
        },
        choices: [String],
        isDraft: Boolean,
        allottedTime: {
            type: Number,
            default: 23,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

questionSchema.statics.build = (attrs: QuestionAttrs) => {
    return new Question(attrs);
};

export const Question = model<QuestionDoc, QuestionModel>(
    "Question",
    questionSchema
);
