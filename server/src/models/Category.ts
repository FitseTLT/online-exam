import { Document, Model, model, Schema } from "mongoose";

interface CategoryAttrs {
    name: string;
    code: string;
    icon: string;
}

export interface CategoryDoc extends Document {
    name: string;
    code: string;
    icon: string;
}

interface CategoryModel extends Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc;
}

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        img: String,
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

categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

export const Category = model<CategoryDoc, CategoryModel>(
    "Category",
    categorySchema
);
