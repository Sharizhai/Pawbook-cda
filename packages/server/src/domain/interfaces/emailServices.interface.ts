/**
 * Interface IEmailServices - Couche Domaine
 * Définit le contrat pour la gestion de l'envoi d'emails
 */
export interface IEmailServices {

    /**
     * Envoi un mail à un utilisateur
     * @param email
     * @param userFirstName
     * @param userId
     * @returns void
     */
    sendConfirmationEmail(email: string, userFirstName: string, userId: string): Promise<void>;
}