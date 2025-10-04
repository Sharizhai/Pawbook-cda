export type PostInformations = {
    id: string;
    authorId: {
        id: string;
        name: string;
        firstName: string;
        profilePicture: string;
    } | string;
    textContent?: string;
    photoContent?: string[];
    likes: string[];
    comments: string[];
    updated?: boolean;
    createdAt: string;
    updatedAt: string;
}