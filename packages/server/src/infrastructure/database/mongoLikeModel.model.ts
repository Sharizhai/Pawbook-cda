import mongoose, {Document, Model, Schema} from "mongoose";
import {IMongoLikeDocument} from "$types/mongo";
import {UserDocument} from "$infrastructure/database/mongoUserModel.model";

export type LikeDocument = Document & IMongoLikeDocument;

const likeSchema = new Schema<LikeDocument>(
    {
        authorId: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        postId: [{ type: Schema.Types.ObjectId, ref: "Post", required: false }],
        animalId: { type: Schema.Types.ObjectId, ref: "Animal", required: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

likeSchema.pre("validate", function (next) {
    const hasPost = this.postId !== undefined && this.postId !== null;
    const hasAnimal = this.animalId !== undefined && this.animalId !== null;

    if (!hasPost && !hasAnimal) {
        this.invalidate("postId", "Le postId ou l'animalId doit être fourni");
    } else if (hasPost && hasAnimal) {
        this.invalidate("postId", "Seulement le postId OU l'animalId doit être fourni, pas les deux");
    }
    next();
});

likeSchema.index({ authorId: 1, postId: 1 }, {
    unique: true,
    partialFilterExpression: { postId: { $exists: true } }
});

likeSchema.index({ authorId: 1, animalId: 1 }, {
    unique: true,
    partialFilterExpression: { animalId: { $exists: true } }
});

likeSchema.index({ postId: 1 });

likeSchema.index({ animalId: 1 });

export const MongoLikeModel: Model<LikeDocument> = (mongoose.models.Like as Model<LikeDocument>) || mongoose.model<LikeDocument>(
    "Like",
    likeSchema,
    "likes"
);