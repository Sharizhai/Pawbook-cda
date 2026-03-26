import {IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {SearchUserOrPetUserResponse} from "$application/dto/response";

export class SearchUserOrPetUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly animalRepository: IAnimalRepository,
    ) {
    }

    async execute(query: string): Promise<SearchUserOrPetUserResponse> {
        if (!query || query.trim().length < 2) {
            return { users: [], animals: [] };
        }

        const sanitized = query.trim();

        const [users, animals] = await Promise.all([
            this.userRepository.searchByName(sanitized),
            this.animalRepository.findByFilters({ name: sanitized }),
        ]);

        return {
            users: users.map(user => ({
                id: user.id,
                firstName: user.firstName,
                name: user.name,
                profilePicture: user.profilePicture,
            })),
            animals: animals.map(animal => ({
                ownerId: animal.ownerId,
                name: animal.name,
                type: animal.type,
                picture: animal.picture,
            })),
        };
    }
}