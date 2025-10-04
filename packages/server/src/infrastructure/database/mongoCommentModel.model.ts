import mongoose, { Document, Schema } from "mongoose";
import {IMongoCommentDocument} from "$types/mongo";

export type CommentDocument = Document & IMongoCommentDocument;

const commentSchema = new Schema<CommentDocument>(
    {
        authorId: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        postId: [{ type: Schema.Types.ObjectId, ref: "Post", required: true }],
        textContent: { type: String, required: true },
        updated: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export const MongoCommentModel = mongoose.model<CommentDocument>(
    "Comment",
    commentSchema,
    "comments"
)