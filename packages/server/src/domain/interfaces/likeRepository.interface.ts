import {Like, LikeData} from "$domain/entities/Likes";

/**
 * Interface ILikeRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des likes de Pawbook
 */
export interface ILikeRepository {
    /**
     * Récupère tous les likes d'un post donné
     * @param postId - ID du post
     * @returns Likes trouvés ou array vide
     */
    findAllByPostId(postId: string): Promise<Like[]>;

    /**
     * Récupère tous les likes d'un post donné
     * @param animalId - ID du post
     * @returns Likes trouvés ou array vide
     */
    findAllByAnimalId(animalId: string): Promise<Like[]>;

    /**
     * Récupère un like par son ID
     * @param id - ID du like
     * @returns Like trouvé ou null
     */
    findById(id: string): Promise<Like | null>;

    /**
     * Sauvegarde un nouveau like
     * @param likeData - Données du like à créer
     * @returns Like créé
     */
    create(likeData: LikeData): Promise<Like>;

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
     * Compte le nombre total de likes pour un post donné
     * @param animalId - ID du post
     * @returns Nombre de likes
     */
    countByAnimalId(animalId: string): Promise<number>;

    /**
     * Compte le nombre total de likes pour un auteur donné
     * @param authorId - ID de l'auteur
     * @returns Nombre de likes
     */
    countByAuthorId(authorId: string): Promise<number>;
}