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

export interface IMongoPostDocument {
    _id: ObjectId;
    authorId: ObjectId;
    textContent?: string;
    photoContent?: string[];
    likes: ObjectId[];
    comments: ObjectId[];
    updated: boolean;
    createdAt: Date;
    updatedAt: Date;
}