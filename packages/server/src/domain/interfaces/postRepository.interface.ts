import {Post, PostData} from "$domain/entities/Posts";

/**
 * Interface PostRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des posts de Pawbook
 */
export interface IPostRepository {
    /**
     * Récupère tous les posts
     */
    findAll(): Promise<Post[]>;

    /**
     * Récupère un post par son ID
     * @param id - ID du post
     * @returns Post trouvé ou null
     */
    findById(id: string): Promise<Post | null>;

    /**
     * Récupère les posts par l'id de leur auteur
     * @param authorId - ID de l'auteur
     * @returns Array de posts
     */
    findByAuthorId(authorId: string): Promise<Post[]>;

    /**
     * Sauvegarde un nouveau post
     * @param PostData - Données du post à créer
     * @returns Post créé
     */
    create(PostData: PostData): Promise<Post>;

    /**
     * Met à jour un post existant
     * @param id - ID du post
     * @param PostData - Nouvelles données du post
     * @returns Post mis à jour ou null si non trouvé
     */
    update(id: string, PostData: Partial<PostData>): Promise<Post | null>;

    /**
     * Supprime un post
     * @param id - ID du post à supprimer
     * @returns True si suppression réussie
     */
    delete(id: string): Promise<boolean>;

    /**
     * Compte le nombre total de posts
     * @returns Nombre de posts
     */
    count(): Promise<number>;
}