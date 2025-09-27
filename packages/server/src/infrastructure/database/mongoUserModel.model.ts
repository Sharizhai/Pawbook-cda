import mongoose, { Document, Schema } from "mongoose";
import {IMongoUserDocument} from "$types/mongo";

export type UserDocument = Document & IMongoUserDocument;

const userSchema = new Schema<UserDocument>(
    {
        name: { type: String, required: true },
        firstName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["USER", "ADMIN", "MODERATOR"], default: "USER" },

        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        animals: [{ type: Schema.Types.ObjectId, ref: "Animal" }],
        follows: [{ type: Schema.Types.ObjectId, ref: "User" }],
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],

        profileDescription: { type: String },
        profilePicture: { type: String },
        refreshToken: { type: String },
    },
    {
        timestamps: true,
    }
);

export const MongoUserModel = mongoose.model<UserDocument>(
    "User",
    userSchema,
    "users"
);