export type UserInformations = {
    "id": string,
    "name": string,
    "firstName": string,
    "email": string,
    "role": string,
    "profilePicture"?: string;
    "profileDescription"?: string;
    "posts": string[];
    "animals": string[];
    "follows": string[];
    "createdAt": Date;
    "updatedAt": Date;
}

export type PublicUserInformations = {
    id: string;
    firstName: string;
    name: string;
    profileDescription?: string;
    profilePicture?: string;
    animalsCount: number;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    memberSince: string;
};