import { User, UserData } from '$domain/entities/Users';

/**
 * Filters pour la recherche de membres
 */
export interface UserFilters {
    name?: string;
    firstName?: string;
}

/**
 * Interface UserRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des membres de Pawbook
 */
export interface IUserRepository {
    /**
     * Récupère tous les membres
     */
    findAll(): Promise<User[]>;

    /**
     * Récupère un membre par son ID
     * @param id - ID du membre
     * @returns Membre trouvé ou null
     */
    findById(id: string): Promise<User | null>;

    /**
     * Récupère un membre par son email
     * @param email - Email du membre
     * @returns Membre trouvé ou null
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Vérifie si un email existe déjà
     * @param email - Email à vérifier
     * @param excludeId - ID à exclure de la vérification (pour les mises à jour)
     * @returns True si l'email existe
     */
    emailExists(email: string, excludeId?: string): Promise<boolean>;

    /**
     * Sauvegarde un nouveau membre
     * @param userData - Données du membre à créer
     * @returns Membre créé
     */
    save(userData: UserData): Promise<User>;

    /**
     * Met à jour un membre existant
     * @param id - ID du membre
     * @param userData - Nouvelles données du membre
     * @returns Membre mis à jour ou null si non trouvé
     */
    update(id: string, userData: Partial<UserData>): Promise<User | null>;

    /**
     * Supprime un membre
     * @param id - ID du membre à supprimer
     * @returns True si suppression réussie
     */
    delete(id: string): Promise<boolean>;

    /**
     * Filtre les membres selon des critères
     * @param filters - Critères de filtrage
     * @returns Liste des membres filtrés
     */
    findByFilters(filters: UserFilters): Promise<User[]>;

    /**
     * Trouve les membres qui suivent un membre donné
     */
    findFollowers(userId: string): Promise<User[]>;

    /**
     * Trouve les membres suivis par un membre donné
     */
    findFollowing(userId: string): Promise<User[]>;

    /**
     * Cherche des membres par nom/prénom (recherche)
     */
    searchByName(query: string): Promise<User[]>;

    /**
     * Compte le nombre total de membres
     * @returns Nombre de membres
     */
    count(): Promise<number>;
}