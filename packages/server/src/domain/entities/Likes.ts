/**
 * Entité Like - Couche Domaine
 * Représente un like sur un post dans PawBook
 */

export interface LikeData {
    id: string;
    authorId: string;
    postId?: string;
    animalId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Like {
    public readonly id: string;
    public readonly authorId: string;
    public readonly postId?: string;
    public readonly animalId?: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: LikeData) {
        if (!data.postId && !data.animalId) {
            throw new Error("Like must have either a postId or an animalId");
        }
        if (data.postId && data.animalId) {
            throw new Error("Like cannot have both a postId and an animalId");
        }

        this.id = data.id;
        this.authorId = data.authorId;
        this.postId = data.postId;
        this.animalId = data.animalId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
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
     * Vérifie si le like appartient à un animal spécifique
     */
    belongsToAnimal(animalId: string): boolean {
        return this.animalId === animalId;
    }

    /**
     * Vérifie si c'est un like sur un post
     */
    isPostLike(): boolean {
        return !!this.postId;
    }

    /**
     * Vérifie si c'est un like sur un animal
     */
    isAnimalLike(): boolean {
        return !!this.animalId;
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
    getPublicData(): Omit<LikeData, 'updatedAt'> {
        const { updatedAt, ...publicData } = this;
        return publicData;
    }

    /**
     * Crée une instance Like depuis un document MongoDB
     */
    static fromMongoDocument(doc: any): Like {
        return new Like({
            id: doc._id.toString(),
            authorId: doc.authorId.toString(),
            postId: doc.postId?.toString(),
            animalId: doc.animalId?.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    /**
     * Crée un nouveau like sur un post
     */
    static createPostLike(authorId: string, postId: string): Like {
        const now = new Date();
        return new Like({
            id: '',
            authorId,
            postId,
            createdAt: now,
            updatedAt: now
        });
    }

    /**
     * Crée un nouveau like sur un animal
     */
    static createAnimalLike(authorId: string, animalId: string): Like {
        const now = new Date();
        return new Like({
            id: '',
            authorId,
            animalId,
            createdAt: now,
            updatedAt: now
        });
    }

    /**
     * Retourne une représentation JSON
     */
    toJSON(): ReturnType<typeof this.getPublicData> {
        return this.getPublicData();
    }
}