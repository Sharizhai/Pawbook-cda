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