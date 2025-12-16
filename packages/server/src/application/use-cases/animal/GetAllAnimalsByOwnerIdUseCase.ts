import {IAnimalRepository} from "$domain/interfaces/animalRepository.interface";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {Animal} from "$domain/entities/Animals";

export class GetAllAnimalsByOwnerIdUseCase {
    constructor(
        private readonly animalRepository: IAnimalRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(page: number, limit: number, ownerId: string): Promise<{ animals: Animal[], hasMore: boolean }> {
        const user = await this.userRepository.findById(ownerId);

        if (!user) {
            throw new Error("User not found");
        }

        const animals = await this.animalRepository.findByOwnerId(ownerId, page, limit + 1);

        const hasMore = animals.length > limit;
        const animalsToReturn = hasMore ? animals.slice(0, limit) : animals;

        return { animals: animalsToReturn, hasMore };
    }
}