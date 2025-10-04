export type PostInformations = {
    "id": string,
    authorId: string;
    textContent?: string;
    photoContent?: string[];
    likes: string[];
    comments: string[];
    updated?: Boolean;
    createdAt: Date;
    updatedAt: Date;
}