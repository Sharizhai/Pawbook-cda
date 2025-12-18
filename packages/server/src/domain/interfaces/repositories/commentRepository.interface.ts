import {Comment, CommentData} from "$domain/entities/Comments";

/**
 * Interface CommentRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des commentaires de Pawbook
 */
export interface ICommentRepository {
    /**
     * Récupère tous les commentaires d'un auteur donné
     * @param authorId - ID de l'auteur
     * @returns Commentaires trouvés ou array vide
     */
    findAllByAuthorId(authorId: string): Promise<Comment[]>;

    /**
     * Récupère tous les commentaires d'un post donné
     * @param postId - ID du post
     * @returns Commentaires trouvés ou array vide
     */
    findAllByPostId(postId: string): Promise<Comment[]>;

    /**
     * Récupère un commentaire par son ID
     * @param id - ID du commentaire
     * @returns Commentaire trouvé ou null
     */
    findById(id: string): Promise<Comment | null>;

    /**
     * Sauvegarde un nouveau commentaire
     * @param commentData - Données du commentaire à créer
     * @returns Commentaire créé
     */
    create(commentData: CommentData): Promise<Comment>;

    /**
     * Met à jour un commentaire existant
     * @param id - ID du commentaire
     * @param commentData - Nouvelles données du commentaire
     * @returns Commentaire mis à jour ou null si non trouvé
     */
    update(id: string, commentData: Partial<CommentData>): Promise<Comment | null>;

    /**
     * Supprime un commentaire
     * @param id - ID du commentaire à supprimer
     * @returns True si suppression réussie
     */
    delete(id: string): Promise<boolean>;

    /**
     * Compte le nombre total de commentaires
     * @returns Nombre de commentaires
     */
    count(): Promise<number>;

    /**
     * Compte le nombre total de commentaires pour un post donné
     * @param postId - ID du post
     * @returns Nombre de commentaires
     */
    countByPostId(postId: string): Promise<number>;

    /**
     * Compte le nombre total de commentaires pour un auteur donné
     * @param authorId - ID de l'auteur
     * @returns Nombre de commentaires
     */
    countByAuthorId(authorId: string): Promise<number>;
}