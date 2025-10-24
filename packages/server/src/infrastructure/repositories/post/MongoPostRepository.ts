import {MongoPostModel} from "$infrastructure/database/mongoPostModel.model";
import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {Post, PostData} from "$domain/entities/Posts";

export class MongoPostRepository implements IPostRepository {
    async findAll(page: number, limit: number): Promise<Post[]> {
        const skip = (page - 1) * limit;
        const docs = await MongoPostModel.find()
                                                .sort({ createdAt: -1 })
                                                .skip(skip).limit(limit + 1)
                                                .populate({path: "authorId",
                                                           select: "name firstName profilePicture"})
                                                .populate({path: "likes", populate: {
                                                    path: "authorId",
                                                    select: "_id name firstName profilePicture"}})
                                                .populate({path: "comments", populate: {
                                                    path: "authorId",
                                                    select: "_id name firstName profilePicture"}}).exec();

        return docs.map((doc) => {
            const raw: PostData = doc.toJSON();
            return new Post(raw);
        });
    }

    async findById(id: string): Promise<Post | null> {
        const doc = await MongoPostModel.findById(id)
                                                .populate({path: "authorId",
                                                           select: "name firstName profilePicture"})
                                                .populate({path: "likes", populate: {
                                                    path: "authorId",
                                                    select: "_id name firstName profilePicture"}})
                                                .populate({path: "comments", populate: {
                                                    path: "authorId",
                                                    select: "_id name firstName profilePicture"}}).exec();

        return doc ? new Post(doc.toObject() as PostData) : null;
    }

    async findByAuthorId(authorId: string, page: number, limit: number): Promise<Post[]> {
        const docs = await MongoPostModel.find({ authorId }).sort({ createdAt: -1 })
                                                .skip(page).limit(limit)
                                                .populate({path: "authorId",
                                                        select: "name firstName profilePicture"})
                                                .populate({path: "likes", populate: {
                                                        path: "authorId",
                                                        select: "_id name firstName profilePicture"}})
                                                .populate({path: "comments", populate: {
                                                        path: "authorId",
                                                        select: "_id name firstName profilePicture"}}).exec();
        return docs.map((doc) => new Post(doc.toObject() as PostData));
    }

    async create(postData: PostData): Promise<Post> {
        const doc = await MongoPostModel.create(postData);
        return new Post(doc.toObject() as PostData);
    }

    async update(id: string, postData: Partial<PostData>): Promise<Post | null> {
        const doc = await MongoPostModel.findByIdAndUpdate({ id }, postData, {
            new: true,
        });
        return doc ? new Post(doc.toObject() as PostData) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await MongoPostModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    async count(): Promise<number> {
        return await MongoPostModel.countDocuments();
    }
}