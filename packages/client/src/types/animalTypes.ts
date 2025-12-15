export type AnimalInformations = {
    "ownerId": string,
    "name": string,
    "type": string;
    "race"?: string;
    "age"?: number;
    "picture"?: string;
    "description"?: string;
    "likes": string[];
    "createdAt": Date;
    "updatedAt": Date;
}