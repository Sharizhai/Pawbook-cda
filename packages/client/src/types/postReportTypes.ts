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
    postId: {
        id: string;
        authorId: {
            id: string;
            name: string;
            firstName: string;
            profilePicture: string;
        } | string;
        textContent?: string;
        photoContent?: string[];
        reportCount: number;
        moderationStatus: string;
    } | string;
    reporterId: string;
    reason: PostReportReason;
    description?: string;
    createdAt: string;
}