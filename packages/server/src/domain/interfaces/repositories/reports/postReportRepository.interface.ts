import {PostReport, PostReportData} from "$domain/entities/PostReports";

/**
 * Interface PostReportRepository - Couche Domaine
 * Définit le contrat pour l'accès aux données des signalements de post sur Pawbook
 */

export interface IPostReportRepository {
    /**
     * Récupère tous les posts signalés
     * @param page
     * @param limit
     * @returns Array de signalements de post
     */
    findAll(page: number, limit: number): Promise<PostReport[]>;

    /**
     * Récupère un signalement par son ID
     * @param id - ID du post
     * @returns Signalement trouvé ou null
     */
    findById(id: string): Promise<PostReport | null>;

    /**
     * Récupère les signalements par l'id de la personne qui a signalé
     * @param reporterId - ID de l'auteur
     * @param page
     * @param limit
     * @returns Array de signalements de post
     */
    findByReporterId(reporterId: string, page: number, limit: number): Promise<PostReport[]>;

    /**
     * Récupère les signalements par l'id du créateur du post
     * @param postAuthorId - ID de l'auteur
     * @param page
     * @param limit
     * @returns Array de signalements de post
     */
    findByPostAuthorId(postAuthorId: string, page: number, limit: number): Promise<PostReport[]>;

    /**
     * Sauvegarde un nouveau signalement de post
     * @param ReportPostData - Données du signalement à créer
     * @returns Signalement créé
     */
    save(ReportPostData: PostReportData): Promise<PostReport>;

    /**
     * Met à jour un post existant
     * @param id - ID du signalement
     * @param ReportPostData - Nouvelles données du signalement
     * @returns Signalement mis à jour ou null si non trouvé
     */
    update(id: string, ReportPostData: Partial<PostReportData>): Promise<PostReport  | null>;
}