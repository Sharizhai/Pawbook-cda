/**
 * Entité Like pour les posts - Couche Domaine
 * Représente un like sur un post dans PawBook
 */
import {randomUUID} from "crypto";
import {User, UserData} from "$domain/entities/Users";

export interface PostLikeData {
    id: string;
    authorId: string;
    postId: string;
    createdAt: Date;
}

export class PostLike {
    public readonly id: string;
    public readonly authorId: string;
    public readonly postId: string;
    public readonly createdAt: Date;

    constructor(data: PostLikeData) {
        if (!data.postId) {
            throw new Error("Like must have a postId");
        }

        this.id = data.id;
        this.authorId = data.authorId;
        this.postId = data.postId;
        this.createdAt = data.createdAt;
    }

    /**
     * Vérifie si le like appartient à un utilisateur spécifique
     */
    belongsToUser(userId: string): boolean {
        return this.authorId === userId;
    }

    /**
     * Vérifie si le like appartient à un post spécifique
     */
    belongsToPost(postId: string): boolean {
        return this.postId === postId;
    }

    /**
     * Vérifie si un utilisateur peut supprimer ce like
     * (seul l'auteur du like peut le supprimer)
     */
    canBeDeletedBy(userId: string, userRole?: string): boolean {
        return this.belongsToUser(userId) || userRole === 'ADMIN';
    }

    /**
     * Vérifie si le like correspond à une combinaison user/post
     */
    matches(userId: string, postId: string): boolean {
        return this.authorId === userId && this.postId === postId;
    }

    /**
     * Retourne les données publiques du like
     */
    getPublicData(): Omit<PostLikeData, 'id'> {
        const { id, ...publicData } = this;
        return publicData;
    }

    /**
     * Crée un nouveau like sur un post
     */
    static create(data: Omit<PostLikeData, 'id' | 'createdAt'>): PostLike {
        return new PostLike({
            ...data,
            id: randomUUID(),
            createdAt: new Date(),
        });
    }

    /**
     * Retourne une représentation JSON
     */
    toJSON(): ReturnType<typeof this.getPublicData> {
        return this.getPublicData();
    }
}