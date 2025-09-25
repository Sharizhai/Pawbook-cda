export interface IMongoUserDocument {
    _id: ObjectId;
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN" | "MODERATOR";
    posts?: ObjectId[];
    animals?: ObjectId[];
    follows?: ObjectId[];
    followers?: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    profileDescription?: string;
    profilePicture?: string;
    refreshToken?: string;
}