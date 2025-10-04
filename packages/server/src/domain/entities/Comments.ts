/**
 * Comment entity - Couche Domaine
 * Represent a comment on a post in PawBook
 */

export interface CommentData {
    id: string;
    authorId: string;
    postId: string;
    textContent: string;
    updated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Comment {
    public readonly id: string;
    public readonly authorId: string;
    public readonly postId: string;
    public readonly textContent: string;
    public readonly updated: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: CommentData) {
        this.id = data.id;
        this.authorId = data.authorId;
        this.postId = data.postId;
        this.textContent = data.textContent;
        this.updated = data.updated;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    /**
     * Check if the user is the author of the comment
     */
    isAuthor(userId: string): boolean {
        return this.authorId === userId;
    }

    /**
     * Check if the comment belongs to a specific post
     */
    belongsToPost(postId: string): boolean {
        return this.postId === postId;
    }

    /**
     * Check if the comment was updated
     */
    wasUpdated(): boolean {
        return this.updated;
    }

    /**
     * Check if the comment is empty
     */
    isEmpty(): boolean {
        return !this.textContent.trim();
    }

    /**
     * Retourne la longueur du contenu
     */
    getContentLength(): number {
        return this.textContent.trim().length;
    }

    /**
     * Vérifie si le commentaire est long (plus de 200 caractères)
     */
    isLongComment(): boolean {
        return this.getContentLength() > 200;
    }

    /**
     * Retourne un aperçu du commentaire (tronqué)
     */
    getContentPreview(maxLength: number = 50): string {
        if (this.textContent.length <= maxLength) {
            return this.textContent;
        }
        return this.textContent.substring(0, maxLength) + '...';
    }

    /**
     * Vérifie si un utilisateur peut modifier ce commentaire
     */
    canBeModifiedBy(userId: string, userRole?: string): boolean {
        // L'auteur peut modifier dans les 30 minutes suivant la création
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const canAuthorEdit = this.isAuthor(userId) && this.createdAt > thirtyMinutesAgo;

        return canAuthorEdit || userRole === 'ADMIN' || userRole === 'MODERATOR';
    }

    /**
     * Vérifie si un utilisateur peut supprimer ce commentaire
     */
    canBeDeletedBy(userId: string, userRole?: string): boolean {
        return this.isAuthor(userId) || userRole === 'ADMIN' || userRole === 'MODERATOR';
    }

    /**
     * Vérifie si le commentaire contient des mots interdits (exemple basique)
     */
    containsInappropriateContent(): boolean {
        const inappropriateWords = ['spam', 'abuse']; // À compléter avec votre liste
        const lowerContent = this.textContent.toLowerCase();
        return inappropriateWords.some(word => lowerContent.includes(word));
    }

    /**
     * Retourne les données publiques du commentaire
     */
    getPublicData(): CommentData {
        return { ...this };
    }

    /**
     * Crée une nouvelle instance avec des données mises à jour
     */
    updateWith(updates: Partial<Omit<CommentData, 'id' | 'authorId' | 'postId' | 'createdAt'>>): Comment {
        return new Comment({
            ...this,
            ...updates,
            updated: true,
            updatedAt: new Date()
        });
    }

    /**
     * Crée une instance Comment depuis un document MongoDB
     */
    static fromMongoDocument(doc: any): Comment {
        return new Comment({
            id: doc._id.toString(),
            authorId: doc.authorId.toString(),
            postId: doc.postId.toString(),
            textContent: doc.textContent || '',
            updated: doc.updated || false,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    /**
     * Retourne une représentation JSON
     */
    toJSON(): CommentData {
        return this.getPublicData();
    }
}