import mongoose, { Document, Schema } from "mongoose";
import {IMongoPostDocument} from "$types/mongo";

export type PostDocument = Document & IMongoPostDocument;

const postSchema = new Schema<PostDocument>(
    {
        authorId: [{ type: Schema.Types.ObjectId, ref: "User" }],
        textContent: { type: String },
        photoContent: { type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        updated: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export const MongoPostModel = mongoose.model<PostDocument>(
    "Post",
    postSchema,
    "posts"
);