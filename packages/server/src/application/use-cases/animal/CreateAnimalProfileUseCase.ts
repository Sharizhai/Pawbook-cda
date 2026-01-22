import {IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {AnimalCreationDto, animalCreationValidation} from "$presentation/dto/validation";
import {Animal} from "$domain/entities/Animals";

export class CreateAnimalProfileUseCase {
    constructor(
        private readonly animalRepository: IAnimalRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(dto: AnimalCreationDto): Promise<Animal> {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            name: dto.name.trim(),
            type: dto.type.trim(),
            race: dto.race?.trim(),
            description: dto.description?.trim(),
        };

        // 2. Validation des données entrantes
        const validation = animalCreationValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
        }

        const validData = validation.data;

        // 3. Vérification de l'existence du propriétaire
        const owner = await this.userRepository.findById(validData.ownerId);
        if (!owner) {
            throw new Error("Utilisateur non trouvé");
        }

        // 4. Création de l'animal
        const animal = Animal.create({
            ownerId: validData.ownerId,
            name: validData.name,
            type: validData.type,
            race: validData.race,
            age: validData.age,
            picture: validData.picture,
            description: validData.description,
        });

        // 5. Sauvegarde de l'animal
        const savedAnimal = await this.animalRepository.save(animal);

        // 6. Retour de l'animal créé
        return savedAnimal;
    }
}