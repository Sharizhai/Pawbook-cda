import {Follow} from "$domain/entities/Follows";

export interface IFollowRepository {
    /**
     * Récupère un follow par son ID
     * @param id - ID du follow
     * @returns Follow trouvé ou null
     */
    findById(id: string): Promise<Follow | null>;

    /**
     * Trouve un follow spécifique entre deux utilisateurs
     * @param followerId - ID du follower
     * @param followingId - ID du followed
     * @returns Follow trouvé ou null
     */
    findByUsers(followerId: string, followingId: string): Promise<Follow | null>;

    /**
     * Trouve tous les utilisateurs suivis par un follower
     *  @param followerId - ID du follower
     *  @returns Liste des follows où l'utilisateur est follower
     */
    findByFollowerId(followerId: string): Promise<Follow[]>;

    /**
     * Trouve tous les followers d'un utilisateur
     * @param followingId - ID du followed
     * @returns Liste des follows où l'utilisateur est followed
     */
    findByFollowingId(followingId: string): Promise<Follow[]>;

    /**
     * Vérifie si un utilisateur suit un autre
     * @param followerId - ID du follower
     * @param followingId - ID du followed
     * @returns True si le follow existe
     */
    exists(followerId: string, followingId: string): Promise<boolean>;

    /**
     * Vérifie si deux utilisateurs se suivent mutuellement
     * @param userId1 - ID du follower
     * @param userId2 - ID du followed
     * @returns True si les deux utilisateurs suivent mutuellement
     */
    areMutualFollowers(userId1: string, userId2: string): Promise<boolean>;

    /**
     * Récupère les followers mutuels de deux utilisateurs
     * @param userId1 - ID du follower
     * @param userId2 - ID du followed
     * @returns Liste des followers mutuels
     */
    findMutualFollowers(userId1: string, userId2: string): Promise<Follow[]>;

    /**
     * Sauvegarde un nouveau follow
     * @param follow - Données du follow à sauvegarder
     * @returns Follow créé
     */
    save(follow: Follow): Promise<Follow>;

    /**
     * Supprime un follow par son ID
     * @param id - ID du follow à supprimer
     * @returns True si suppression réussie
     */
    delete(id: string): Promise<boolean>;

    /**
     * Supprime un follow entre deux utilisateurs
     * @param followerId - ID du follower
     * @param followingId - ID du followed
     * @returns True si suppression réussie
     */
    deleteByUsers(followerId: string, followingId: string): Promise<boolean>;

    /**
     * Compte le nombre total de follows
     * @returns Nombre de follows
     */
    count(): Promise<number>;

    /**
     * Compte le nombre de followers d'un utilisateur
     * @param userId - ID de l'utilisateur
     * @returns Nombre de followers
     */
    countFollowers(userId: string): Promise<number>;

    /**
     * Compte le nombre d'utilisateurs suivis par un utilisateur
     * @param userId - ID de l'utilisateur
     * @returns Nombre de following
     */
    countFollowing(userId: string): Promise<number>;
}