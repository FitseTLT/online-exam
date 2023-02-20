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
        virtuals: {
            totalEasy: {
                get() {
                    return this.sections.reduce(
                        (prev: number, section) => prev + (section.easy ?? 0),
                        0
                    );
                },
            },
            totalMedium: {
                get() {
                    return this.sections.reduce(
                        (prev: number, section) => prev + (section.medium ?? 0),
                        0
                    );
                },
            },
            totalHard: {
                get() {
                    return this.sections.reduce(
                        (prev: number, section) => prev + (section.hard ?? 0),
                        0
                    );
                },
            },
        },
        timestamps: true,
        toJSON: {
            virtuals: true,
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
