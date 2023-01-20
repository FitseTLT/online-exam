import { Document, Model, model, Schema } from "mongoose";
import { CategoryDoc } from "./Category";

interface ExamAttrs {
    name: string;
    sections: {
        category: CategoryDoc;
        easy?: number;
        medium?: number;
        hard?: number;
    }[];
}

export interface ExamDoc extends Document {
    name: string;
    sections: {
        category: CategoryDoc;
        easy: number;
        medium: number;
        hard: number;
    }[];
}

interface ExamModel extends Model<ExamDoc> {
    build(attrs: ExamAttrs): ExamDoc;
}

const examSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        sections: [
            {
                category: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "Category",
                },
                easy: Number,
                medium: Number,
                hard: Number,
            },
        ],
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

examSchema.statics.build = (attrs: ExamAttrs) => {
    return new Exam(attrs);
};

export const Exam = model<ExamDoc, ExamModel>("Exam", examSchema);
