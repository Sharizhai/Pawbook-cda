import {PostLike, PostLikeData} from "$domain/entities/PostLike";

/**
 * Interface IPostLikeRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des likes des posts de Pawbook
 */
export interface IPostLikeRepository {
    /**
     * Récupère tous les likes d'un post donné
     * @param postId - ID du post
     * @returns Likes trouvés ou array vide
     */
    findAllByPostId(postId: string): Promise<PostLike[]>;

    /**
     * Récupère un like par son ID
     * @param id - ID du like
     * @returns Like trouvé ou null
     */
    findById(id: string): Promise<PostLike | null>;

    /**
     * Récupère un like par l'auteur et le post
     * @param authorId - ID de l'auteur
     * @param postId - ID du post
     * @returns Like trouvé ou null
     */
    findByAuthorAndPost(authorId: string, postId: string): Promise<PostLike | null>;

    /**
     * Sauvegarde un nouveau like
     * @param likeData - Données du like à créer
     * @returns Like créé
     */
    save(likeData: PostLikeData): Promise<PostLike>;

    /**
     * Supprime un like
     * @param id - ID du like à supprimer
     * @returns True si suppression réussie
     */
    delete(id: string): Promise<boolean>;

    /**
     * Compte le nombre total de likes
     * @returns Nombre de likes
     */
    count(): Promise<number>;

    /**
     * Compte le nombre total de likes pour un post donné
     * @param postId - ID du post
     * @returns Nombre de likes
     */
    countByPostId(postId: string): Promise<number>;

    /**
     * Compte le nombre total de likes pour un auteur donné
     * @param authorId - ID de l'auteur
     * @returns Nombre de likes
     */
    countByAuthorId(authorId: string): Promise<number>;
}