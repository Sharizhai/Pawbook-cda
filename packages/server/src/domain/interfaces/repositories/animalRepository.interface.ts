import {Animal, AnimalData} from "$domain/entities/Animals";
import {UserFilters} from "$domain/interfaces/repositories/userRepository.interface";
import {User} from "$domain/entities/Users";

/**
 * Filters pour la recherche d'animal
 */
export interface AnimalFilters {
    name?: string;
}

/**
 * Interface AnimalRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des animaux de Pawbook
 */

export interface IAnimalRepository {
    /**
     * Récupère tous les animaux
     */
    findAll(): Promise<Animal[]>;

    /**
     * Récupère un animal par son ID
     * @param id - ID de l'animal
     * @returns Animal trouvé ou null
     */
    findById(id: string): Promise<Animal | null>;

    /**
     * Récupère un animal par l'ID de son propriétaire
     * @param ownerId - ID du propriétaire
     * @param page
     * @param limit
     * @returns Animal trouvé ou null
     */
    findByOwnerId(ownerId: string, page: number, limit: number): Promise<Animal[]>;

    /**
     * Sauvegarde un nouvel animal
     * @param animal - Données de l'animal à sauvegarder
     * @returns Animal créé
     */
    save(animal: Animal): Promise<Animal>;

    /**
     * Met à jour un animal existant
     * @param id - ID de l'animal
     * @param animalData - Nouvelles données de l'animal
     * @returns Animal mis à jour ou null si non trouvé
     */
    update(id: string, animalData: Partial<AnimalData>): Promise<Animal | null>;

    /**
     * Supprime un animal
     * @param id - ID de l'animal à supprimer
     * @returns True si suppression réussie
     */
    delete(id: string): Promise<boolean>;

    /**
     * Filtre les animaux selon des critères
     * @param filters - Critères de filtrage
     * @returns Liste des animaux filtrés
     */
    findByFilters(filters: AnimalFilters): Promise<Animal[]>;

    /**
     * Compte le nombre total d'animaux
     * @returns Nombre d'animaux
     */
    count(): Promise<number>;
}