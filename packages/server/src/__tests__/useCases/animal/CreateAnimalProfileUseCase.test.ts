import {CreateAnimalProfileUseCase} from "$application/use-cases/animal/CreateAnimalProfileUseCase";
import {IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {AnimalCreationDto} from "$presentation/dto/validation";
import {beforeAll, describe, expect, it} from "vitest";
import container from "$config/dependencyInjection";
import {UnitAnimal} from "../../seeds/unit-animal";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";

describe("Use case: we should be able to create an animal profile", () => {
    let createAnimalProfileUseCase: CreateAnimalProfileUseCase;
    let userRepository: IUserRepository;
    let animalRepository: IAnimalRepository;
    let validAnimalData: AnimalCreationDto;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        animalRepository = c.resolve<IAnimalRepository>("animalRepository");

        await userRepository.save(UnitUser.john);
        await animalRepository.save(UnitAnimal.puppy);

        createAnimalProfileUseCase = new CreateAnimalProfileUseCase(animalRepository, userRepository);

        validAnimalData = {
            ownerId: "67164a84291bcc737b9a7e3a",
            name: "Puppy",
            type: "dog",
            picture: ""
        }
    })

    it("Should return an error if name is missing", async () => {
        const invalidData = {
            name: "",
            type: "dog",
            ownerId: "67164a84291bcc737b9a7e3a",
        } as AnimalCreationDto;

        await expect(createAnimalProfileUseCase.execute(invalidData)).rejects.toThrow("Le nom est requis");
    });

    it("Should return an error if type is missing", async () => {
        const invalidData = {
            name: "Pouet",
            type: "",
            ownerId: "67164a84291bcc737b9a7e3a",
        } as AnimalCreationDto;

        await expect(createAnimalProfileUseCase.execute(invalidData)).rejects.toThrow("Le type est requis");
    });

    it("Should return an error if ownerId does not exist", async () => {
        const invalidData = {
            name: "Pouet",
            type: "dog",
            ownerId: "000000000000000000000000",
        } as AnimalCreationDto;

        await expect(createAnimalProfileUseCase.execute(invalidData))
            .rejects.toThrow("Utilisateur non trouvé");
    });

    it("Should trim and normalize animal data before saving", async () => {
        const dataWithSpaces = {
            name: " Pouet   ",
            type: "dog",
            ownerId: "67164a84291bcc737b9a7e3a",
        } as AnimalCreationDto;

        const result = await createAnimalProfileUseCase.execute(dataWithSpaces);

        expect(result.name).toBe("Pouet");
    });

    it("Should update user with new animal Id", async () => {
        const initialAnimalsCount = UnitUser.john.animals.length;

        const newAnimalData = {
            name: "Kitty",
            type: "cat",
            ownerId: "67164a84291bcc737b9a7e3a",
        } as AnimalCreationDto;

        const createdAnimal = await createAnimalProfileUseCase.execute(newAnimalData);
        const updatedUser = await userRepository.findById("67164a84291bcc737b9a7e3a");

        expect(updatedUser).toBeDefined();
        expect(updatedUser!.animals).toHaveLength(initialAnimalsCount + 2);
        expect(updatedUser!.animals).toContain(createdAnimal.id);
    });

    it("Should create a new animal with valid datas", async () => {
        const animal = await createAnimalProfileUseCase.execute(validAnimalData);

        expect(animal).toBeDefined();
        expect(animal.name).toBe("Puppy");
        expect(animal.type).toBe("dog");
        expect(animal.ownerId).toBe("67164a84291bcc737b9a7e3a");
    });
})