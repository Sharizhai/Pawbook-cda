import {MongoCommentModel} from "$infrastructure/database/mongoCommentModel.model";
import {ICommentRepository} from "$domain/interfaces/repositories/commentRepository.interface";
import {Comment, CommentData} from "$domain/entities/Comments";

export class MongoCommentRepository implements ICommentRepository {
    async findAllByAuthorId(authorId: string): Promise<Comment[]> {
        const docs = await MongoCommentModel.find({ authorId })
                                                    .sort({ createdAt: -1 })
                                                    .populate({path: "authorId",
                                                                select: "name firstName profilePicture"})
                                                    .exec();

        return docs.map((doc) => {
            const raw: CommentData = doc.toJSON();
            return new Comment(raw);
        });
    }

    async findAllByPostId(postId: string): Promise<Comment[]> {
        const docs = await MongoCommentModel.find({ postId })
                                                    .sort({ createdAt: -1 })
                                                    .populate({path: "authorId",
                                                               select: "name firstName profilePicture"})
                                                    .exec();

        return docs.map((doc) => {
            const raw: CommentData = doc.toJSON();
            return new Comment(raw);
        });
    }

    async findById(id: string): Promise<Comment | null> {
        const doc = await MongoCommentModel.findById(id)
                                                    .populate({path: "authorId",
                                                               select: "name firstName profilePicture"}).exec();

        return doc ? new Comment(doc.toObject() as CommentData) : null;
    }

    async create(commentData: CommentData): Promise<Comment> {
        const doc = await MongoCommentModel.create(commentData);
        return new Comment(doc.toObject() as CommentData);
    }

    async update(id: string, commentData: Partial<CommentData>): Promise<Comment | null> {
        const doc = await MongoCommentModel.findByIdAndUpdate({id}, commentData, {new: true});
        return doc ? new Comment(doc.toObject() as CommentData) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await MongoCommentModel.deleteOne({_id: id});
        return result.deletedCount === 1;
    }

    async count(): Promise<number> {
        return await MongoCommentModel.countDocuments();
    }

    async countByAuthorId(authorId: string): Promise<number> {
        return await MongoCommentModel.countDocuments({ authorId });
    }

    async countByPostId(postId: string): Promise<number> {
        return await MongoCommentModel.countDocuments({ postId });
    }
}