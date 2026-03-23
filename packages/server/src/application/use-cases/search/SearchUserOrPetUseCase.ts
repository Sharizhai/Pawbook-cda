import {IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {Animal} from "$domain/entities/Animals";
import {User} from "$domain/entities/Users";

export class SearchUserOrPetUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly animalRepository: IAnimalRepository,
    ) {
    }

    async execute(query: string): Promise<{ users: User[], animals: Animal[] }> {
        if (!query || query.trim().length < 2) {
            return { users: [], animals: [] };
        }

        const sanitized = query.trim();

        const [users, animals] = await Promise.all([
            this.userRepository.searchByName(sanitized),
            this.animalRepository.findByFilters({ name: sanitized }),
        ]);

        return { users, animals };
    }
}