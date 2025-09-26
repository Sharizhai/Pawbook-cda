import { User, UserData } from '$domain/entities/Users';
import { UserFilters, IUserRepository } from '$domain/interfaces/userRepository.interface';
import { MongoUserModel } from '../database/mongoUserModel.model';

export class MongoUserRepository implements IUserRepository {
    async findAll(): Promise<User[]> {
        const docs = await MongoUserModel.find();
        return docs.map((doc) => {
            const raw: UserData = doc.toJSON();
            return new User(raw);
        });
    }

    async findById(id: string): Promise<User | null> {
        const doc = await MongoUserModel.findOne({ id });
        return doc ? new User(doc.toObject() as UserData) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await MongoUserModel.findOne({ email: email.toLowerCase() });
        return doc ? new User(doc.toObject() as UserData) : null;
    }

    async emailExists(email: string, excludeId?: string): Promise<boolean> {
        const query: Partial<{ email: string; id?: { $ne: string } }> = {
            email,
        };
        if (excludeId) query.id = { $ne: excludeId };
        const count = await MongoUserModel.countDocuments(query);
        return count > 0;
    }

    async save(memberData: UserData): Promise<User> {
        const doc = await MongoUserModel.create(memberData);
        return new User(doc.toObject() as UserData);
    }

    async update(
        id: string,
        data: Partial<UserData>,
    ): Promise<User | null> {
        const doc = await MongoUserModel.findOneAndUpdate({ id }, data, {
            new: true,
        });
        return doc ? new User(doc.toObject() as UserData) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await MongoUserModel.deleteOne({ id });
        return result.deletedCount === 1;
    }

    async findFollowers(userId: string): Promise<User[]> {
        // Trouve tous les utilisateurs qui ont userId dans leur tableau "follows"
        const docs = await MongoUserModel.find({
            follows: userId
        });
        return docs.map((doc) => new User(doc.toObject() as UserData));
    }

    async findFollowing(userId: string): Promise<User[]> {
        // Récupère l'utilisateur et son tableau "follows"
        const user = await MongoUserModel.findOne({ id: userId });
        if (!user || !user.follows?.length) {
            return [];
        }

        // Trouve tous les utilisateurs dont l'ID est dans le tableau "follows"
        const docs = await MongoUserModel.find({
            id: { $in: user.follows }
        });
        return docs.map((doc) => new User(doc.toObject() as UserData));
    }

    async searchByName(query: string): Promise<User[]> {
        // Recherche globale dans nom ET prénom
        const docs = await MongoUserModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { firstName: { $regex: query, $options: 'i' } }
            ]
        });
        return docs.map((doc) => new User(doc.toObject() as UserData));
    }

    async findByFilters(filters: UserFilters): Promise<User[]> {
        const mongoQuery: any = {};

        if (filters.name) {
            mongoQuery.name = { $regex: filters.name, $options: 'i' };
        }

        if (filters.firstName) {
            mongoQuery.firstName = { $regex: filters.firstName, $options: 'i' };
        }

        // MongoDB fait automatiquement un AND entre les conditions
        const docs = await MongoUserModel.find(mongoQuery);
        return docs.map((doc) => new User(doc.toObject() as UserData));
    }

    async count(): Promise<number> {
        return await MongoUserModel.countDocuments();
    }
}
