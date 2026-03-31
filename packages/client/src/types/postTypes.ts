export enum PostModerationStatus {
    none = "NONE",
    pending = "PENDING",
    approved = "APPROVED",
    rejected = "REJECTED"
}

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
    comments: string[];
    likeCount?: number;
    reportCount: number;
    moderationStatus: PostModerationStatus;
    updated?: boolean;
    createdAt: string;
    updatedAt: string;
}