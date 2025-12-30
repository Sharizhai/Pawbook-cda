/**
 * Entité PostReport - Couche Domaine
 * Représente un signalement de post dans le système
 */
import {randomUUID} from "crypto";

export interface PostReportData {
    id: string;
    postId: string;
    reporterId: string;
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
    reason: "SPAM" | "HARASSMENT" | "HATE_SPEECH" | "VIOLENCE" | "INAPPROPRIATE" | "SEXUAL_CONTENT" | "FALSE_INFORMATION"
        | "COPYRIGHT" | "ANIMAL_ABUSE" | "SELF_HARM" | "OTHER";
    description?: string;
    createdAt: Date;
}

export class PostReport {
    public readonly id: string;
    public readonly postId: string;
    public readonly reporterId: string;
    public readonly post?: {
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
    public readonly reason: "SPAM" | "HARASSMENT" | "HATE_SPEECH" | "VIOLENCE" | "INAPPROPRIATE" | "SEXUAL_CONTENT" | "FALSE_INFORMATION"
        | "COPYRIGHT" | "ANIMAL_ABUSE" | "SELF_HARM" | "OTHER";
    public readonly description?: string;
    public readonly createdAt: Date;

    constructor(data: PostReportData) {
        this.id = data.id;
        this.postId = data.postId;
        this.reporterId = data.reporterId;
        this.post = data.post;
        this.reason = data.reason;
        this.description = data.description;
        this.createdAt = data.createdAt;
    }

    /**
     * Check if the report is about sensitive content
     */
    isSensitiveContent(): boolean {
        const sensitiveReasons = ["HATE_SPEECH", "VIOLENCE", "SEXUAL_CONTENT", "ANIMAL_ABUSE", "SELF_HARM"];
        return sensitiveReasons.includes(this.reason);
    }

    /**
     * Calculate the age of the report in days
     */
    getAgeInDays(): number {
        const diffInMs = Date.now() - this.createdAt.getTime();
        return Math.floor(diffInMs / (24 * 60 * 60 * 1000));
    }

    /**
     * Retourne les données publiques du signalement
     */
    getPublicData(): Omit<PostReportData, 'reporterId'> {
        return {
            id: this.id,
            postId: this.postId,
            reason: this.reason,
            description: this.description,
            createdAt: this.createdAt,
        };
    }

    static create(data: Omit<PostReportData, 'id' | 'createdAt'>): PostReport {
        return new PostReport({
            ...data,
            id: randomUUID(),
            createdAt: new Date(),
        });
    }

    /**
     * Return a JSON representation of the post reported
     */
    toJSON(): ReturnType<typeof this.getPublicData> {
        return this.getPublicData();
    }
}