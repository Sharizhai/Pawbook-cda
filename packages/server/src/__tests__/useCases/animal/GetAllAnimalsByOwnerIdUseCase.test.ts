import {beforeAll, describe, expect, it} from "vitest";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {IAnimalRepository} from "$domain/interfaces/animalRepository.interface";
import {ILikeRepository} from "$domain/interfaces/likeRepository.interface";
import {Container} from "$types/container";
import container from "$config/dependencyInjection";
import {InMemoryAnimalRepository} from "$infrastructure/repositories/animal/inMemoryAnimalRepository";
import {UnitUser} from "../../seeds/unit-user";
import {UnitAnimal} from "../../seeds/unit-animal";
import {GetAllAnimalsByOwnerIdUseCase} from "$application/use-cases/animal/GetAllAnimalsByOwnerIdUseCase";

describe("Use case: we should be able to get all animals with an owner id", () => {
    let userRepository: IUserRepository;
    let animalRepository: IAnimalRepository;
    let likeRepository: ILikeRepository;
    let getAllAnimalsByOwnerIdUseCase: GetAllAnimalsByOwnerIdUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        animalRepository = c.resolve<IAnimalRepository>("animalRepository");
        likeRepository = c.resolve<ILikeRepository>("likeRepository");

        if(animalRepository instanceof InMemoryAnimalRepository) {
            animalRepository.setLikeRepository(likeRepository);
        }

        getAllAnimalsByOwnerIdUseCase = new GetAllAnimalsByOwnerIdUseCase(animalRepository, userRepository);

        await animalRepository.save(UnitAnimal.puppy);
        await animalRepository.save(UnitAnimal.noona);
        await animalRepository.save(UnitAnimal.carpette);
        await animalRepository.save(UnitAnimal.hubert);
        await animalRepository.save(UnitAnimal.ham);

        await userRepository.save(UnitUser.john);
    })

    it("Should return an error if no user with this id is found", async () => {
        const nonExistentUserId = "non-existing-user-id";

        await expect(getAllAnimalsByOwnerIdUseCase.execute(0, 10, nonExistentUserId)).rejects.toThrow();
    });

    it("Should return an array of animals if some are found", async () => {
        const animals = await getAllAnimalsByOwnerIdUseCase.execute(0, 10, UnitUser.john.id);

        expect(animals.animals).toBeDefined();
        expect(animals.animals).toHaveLength(5);
    });

    it("Should return animals sorted by newest first", async () => {
        const animals = await getAllAnimalsByOwnerIdUseCase.execute(0, 10, UnitUser.john.id);

        expect(animals.animals).toHaveLength(5);
        expect(animals.animals[0].id).toBe(UnitAnimal.ham.id);
        expect(animals.animals[1].id).toBe(UnitAnimal.hubert.id);
        expect(animals.animals[2].id).toBe(UnitAnimal.noona.id);
    });

    it("Should paginate animals with a specified limit", async () => {
        const page1 = await getAllAnimalsByOwnerIdUseCase.execute(0, 2, UnitUser.john.id);
        expect(page1.animals).toHaveLength(2);
        expect(page1.animals[0].id).toBe(UnitAnimal.ham.id);
        expect(page1.animals[1].id).toBe(UnitAnimal.hubert.id);

        const page2 = await getAllAnimalsByOwnerIdUseCase.execute(2, 2, UnitUser.john.id);
        expect(page2.animals).toHaveLength(2);
        expect(page2.animals[0].id).toBe(UnitAnimal.noona.id);
        expect(page2.animals[1].id).toBe(UnitAnimal.carpette.id);
    });

    it("Should return hasMore: true when more animals exist", async () => {
        const results = await getAllAnimalsByOwnerIdUseCase.execute(1, 2, UnitUser.john.id);

        expect(results.hasMore).toBe(true);
        expect(results.animals).toHaveLength(2);
    });

    it("Should return hasMore: false when no more animals exist", async () => {
        const results = await getAllAnimalsByOwnerIdUseCase.execute(1, 10, UnitUser.john.id);

        expect(results.hasMore).toBe(false);
        expect(results.animals).toHaveLength(4);
    });

    it("Should include likesCount for each animal", async () => {
        const animals = await getAllAnimalsByOwnerIdUseCase.execute(0, 2, UnitUser.john.id);

        expect(animals.animals).toHaveLength(2);

        const returnedAnimal = animals.animals[0];

        expect(returnedAnimal.likes?.length).toBe(2);
    });
})