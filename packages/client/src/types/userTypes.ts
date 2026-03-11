export type UserInformations = {
    "id": string,
    "name": string,
    "firstName": string,
    "email": string,
    "role": string,
    "profilePicture"?: string;
    "profileDescription"?: string;
    "createdAt": Date;
    "updatedAt": Date;
}

export type PublicUserInformations = {
    id: string;
    firstName: string;
    name: string;
    profileDescription?: string;
    profilePicture?: string;
    memberSince: string;
};

export type UserUpdateInformations = Partial<Pick<UserInformations,
    "profilePicture" |
    "profileDescription">>