/**
 * Post Entity - Couche Domaine
 * Represent a post in PawBook
 */

export interface PostData {
    id: string;
    authorId: string;
    textContent?: string;
    photoContent?: string[];
    likes?: string[];
    comments?: string[];
    updated?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Post {
    public readonly id: string;
    public readonly authorId: string;
    public readonly textContent?: string;
    public readonly photoContent?: string[];
    public readonly likes?: string[];
    public readonly comments?: string[];
    public readonly updated?: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: PostData) {
        this.id = data.id;
        this.authorId = data.authorId;
        this.textContent = data.textContent;
        this.photoContent = data.photoContent ? [...data.photoContent] : [];
        this.likes = data.likes ? [...data.likes] : [];
        this.comments = data.comments ? [...data.comments] : [];
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
     * Retourne le nombre de likes
     */
    getLikesCount(): number {
        return this.likes.length;
    }

    /**
     * Retourne le nombre de commentaires
     */
    getCommentsCount(): number {
        return this.comments.length;
    }

    /**
     * Vérifie si un utilisateur a liké ce post
     */
    isLikedBy(userId: string): boolean {
        return this.likes.includes(userId);
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
     * Crée une instance Post depuis un document MongoDB
     */
    static fromMongoDocument(doc: any): Post {
        return new Post({
            id: doc._id.toString(),
            authorId: doc.authorId.toString(),
            textContent: doc.textContent || '',
            photoContent: doc.photoContent || [],
            likes: doc.likes?.map((like: any) => like.toString()) || [],
            comments: doc.comments?.map((comment: any) => comment.toString()) || [],
            updated: doc.updated || false,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    /**
     * Retourne une représentation JSON
     */
    toJSON(): PostData {
        return this.getPublicData();
    }
}