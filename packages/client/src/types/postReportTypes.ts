export enum PostReportReason {
    spam = "SPAM",
    harassment = "HARASSMENT",
    hateSpeech = "HATE_SPEECH",
    violence = "VIOLENCE",
    inappropriate = "INAPPROPRIATE",
    sexualContent = "SEXUAL_CONTENT",
    falseInformation = "FALSE_INFORMATION",
    copyright = "COPYRIGHT",
    animalAbuse = "ANIMAL_ABUSE",
    selfHarm = "SELF_HARM",
    other = "OTHER"
}

export type PostReportInformations = {
    id: string;
    postId: string;
    reporterId: string;
    reporter?: {
        id: string;
        name: string;
        firstName: string;
        profilePicture: string | null;
    };
    post?: {
        id: string;
        authorId: string;
        textContent?: string;
        photoContent?: string[];
        reportCount: number;
        moderationStatus: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
        author?: {
            id: string;
            name: string;
            firstName: string;
            profilePicture: string | null;
        };
    };
    reason: PostReportReason;
    description?: string;
    createdAt: string;
}