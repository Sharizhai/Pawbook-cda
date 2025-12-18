import {MongoLikeModel} from "$infrastructure/database/mongoLikeModel.model";
import {ILikeRepository} from "$domain/interfaces/repositories/likeRepository.interface";
import {Like, LikeData} from "$domain/entities/Likes";

export class MongoLikeRepository implements ILikeRepository {
    async findAllByPostId(postId: string): Promise<Like[]> {
        const docs = await MongoLikeModel.find({postId}).exec();

        return docs.map((doc) => {
            const raw: LikeData = doc.toJSON();
            return new Like(raw);
        });
    }

    async findAllByAnimalId(animalId: string): Promise<Like[]> {
        const docs = await MongoLikeModel.find({animalId}).exec();

        return docs.map((doc) => {
            const raw: LikeData = doc.toJSON();
            return new Like(raw);
        });
    }

    async findById(id: string): Promise<Like | null> {
        const doc = await MongoLikeModel.findById(id).exec();

        return doc ? new Like(doc.toObject() as LikeData) : null;
    }

    async create(likeData: LikeData): Promise<Like> {
        const doc = await MongoLikeModel.create(likeData);
        return new Like(doc.toObject() as LikeData);
    }

    async delete(id: string): Promise<boolean> {
        const result = await MongoLikeModel.deleteOne({_id: id});
        return result.deletedCount === 1;
    }

    async count(): Promise<number> {
        return await MongoLikeModel.countDocuments();
    }

    async countByPostId(postId: string): Promise<number> {
        return await MongoLikeModel.countDocuments({postId});
    }

    async countByAnimalId(animalId: string): Promise<number> {
        return await MongoLikeModel.countDocuments({animalId});
    }

    async countByAuthorId(authorId: string): Promise<number> {
        return await MongoLikeModel.countDocuments({authorId});
    }
}