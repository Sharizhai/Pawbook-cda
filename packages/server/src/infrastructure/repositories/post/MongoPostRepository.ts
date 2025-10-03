import {MongoPostModel} from "$infrastructure/database/mongoPostModel.model";
import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {Post, PostData} from "$domain/entities/Posts";

export class MongoPostRepository implements IPostRepository {
    async findAll(): Promise<Post[]> {
        const docs = await MongoPostModel.find();
        return docs.map((doc) => {
            const raw: PostData = doc.toJSON();
            return new Post(raw);
        });
    }

    async findById(id: string): Promise<Post | null> {
        const doc = await MongoPostModel.findById(id);
        return doc ? new Post(doc.toObject() as PostData) : null;
    }

    async findByAuthorId(authorId: string): Promise<Post[]> {
        const docs = await MongoPostModel.find({ authorId });
        return docs.map((doc) => new Post(doc.toObject() as PostData));
    }

    async create(postData: PostData): Promise<Post> {
        const doc = await MongoPostModel.create(postData);
        return new Post(doc.toObject() as PostData);
    }

    async update(id: string, postData: Partial<PostData>): Promise<Post | null> {
        const doc = await MongoPostModel.findOneAndUpdate({ id }, postData, {
            new: true,
        });
        return doc ? new Post(doc.toObject() as PostData) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await MongoPostModel.deleteOne({ id });
        return result.deletedCount === 1;
    }

    async count(): Promise<number> {
        return await MongoPostModel.countDocuments();
    }
}