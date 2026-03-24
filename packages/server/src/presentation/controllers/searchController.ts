import {SearchUserOrPetUseCase} from "$application/use-cases/search/SearchUserOrPetUseCase";
import {getHttpStatus} from "$presentation/errors/httpErrorMapper";
import {APIResponse} from "$utils/responseUtils.utils";

/**
 * SearchController - Couche Présentation
 * Gère les requêtes HTTP relatives aux recherches dans l'application Pawbook
 */

export class SearchController {
    constructor(
        private readonly searchUserOrPetUseCase: SearchUserOrPetUseCase
    ) {}

    /**
     * Search for users or pets based on a search term
     */
    async searchUserOrPet(req: any, res: any) {
        try {
            const { searchTerm } = req.query;

            if (!searchTerm) {
                return res.status(400).json({ error: "invalid search" });
            }

            const result = await this.searchUserOrPetUseCase.execute(searchTerm);

            return APIResponse(res, result, "Request results", 200);
        } catch (error) {
            const status = getHttpStatus(error);
            const message = error instanceof Error ? error.message : "Search error";

            return APIResponse(res, null, message, status);
        }
    }
}