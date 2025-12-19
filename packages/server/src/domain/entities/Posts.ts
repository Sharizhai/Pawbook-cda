/**
 * Post Entity - Couche Domaine
 * Represent a post in PawBook
 */

import { randomUUID } from 'crypto';

export interface PostData {
    id: string;
    authorId: string;
    author?: {
        id: string;
        name: string;
        firstName: string;
        profilePicture: string | null;
    };
    textContent?: string;
    photoContent?: string[];
    reportCount: number;
    moderationStatus: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
    updated?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Post {
    public readonly id: string;
    public readonly authorId: string;
    public readonly author?: {
        id: string;
        name: string;
        firstName: string;
        profilePicture: string | null;
    };
    public readonly textContent?: string;
    public readonly photoContent?: string[];
    public readonly reportCount: number;
    public readonly moderationStatus: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
    public readonly updated?: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: PostData) {
        this.id = data.id;
        this.authorId = data.authorId;
        this.author = data.author;
        this.textContent = data.textContent;
        this.photoContent = data.photoContent ? [...data.photoContent] : [];
        this.reportCount = data.reportCount;
        this.moderationStatus = data.moderationStatus;
        this.updated = data.updated;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    /**
     * Check if the user is the author of the post
     */
    isAuthor(userId: string): boolean {
        return this.authorId === userId;
    }

    /**
     * Vérifie si le post a été modifié
     */
    wasUpdated(): boolean {
        return this.updated;
    }

    /**
     * Vérifie si le post est vide (pas de contenu text ni photo)
     */
    isEmpty(): boolean {
        return !this.textContent.trim() && this.photoContent.length === 0;
    }

    /**
     * Vérifie si un utilisateur peut modifier ce post
     */
    canBeModifiedBy(userId: string, userRole?: string): boolean {
        return this.isAuthor(userId) || userRole === 'ADMIN' || userRole === 'MODERATOR';
    }

    /**
     * Vérifie si un utilisateur peut supprimer ce post
     */
    canBeDeletedBy(userId: string, userRole?: string): boolean {
        return this.isAuthor(userId) || userRole === 'ADMIN' || userRole === 'MODERATOR';
    }

    /**
     * Retourne les données publiques du post
     */
    getPublicData(): PostData {
        return { ...this };
    }

    static create(data: Omit<PostData, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Post {
        return new Post({
            ...data,
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    /**
     * Crée une nouvelle instance avec des données mises à jour
     */
    updateWith(updates: Partial<Omit<PostData, 'id' | 'authorId' | 'createdAt'>>): Post {
        return new Post({
            ...this,
            ...updates,
            updated: true,
            updatedAt: new Date()
        });
    }

    /**
     * Retourne une représentation JSON
     */
    toJSON(): PostData {
        return this.getPublicData();
    }
}