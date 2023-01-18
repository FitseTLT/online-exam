import { Document, Model, model, Schema } from "mongoose";
import { Password } from "../utils/password";
import { UserRole } from "./enums";

interface UserAttrs {
    name: string;
    email: string;
    password: string;
    picture?: string;
    role?: UserRole;
}

export interface UserDoc extends Document {
    name: string;
    email: string;
    password: string;
    picture: string;
    role: UserRole;
}

interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            get: (src: string) => `${process.env.USER_PICTURE_URL}${src}`,
        },
        role: {
            type: String,
            default: UserRole.User,
            enum: Object.values(UserRole),
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password"));
        this.set("password", hashedPassword);
    }
    done();
});

export const User = model<UserDoc, UserModel>("User", userSchema);
