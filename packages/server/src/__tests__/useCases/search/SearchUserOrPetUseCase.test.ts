import {IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {SearchUserOrPetUseCase} from "$application/use-cases/search/SearchUserOrPetUseCase";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitAnimal} from "../../seeds/unit-animal";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";

describe("Use case: We should be able to search for users or pets", () => {
    let searchUserOrPetUseCase: SearchUserOrPetUseCase;
    let userRepository: IUserRepository;
    let animalRepository: IAnimalRepository;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        animalRepository = c.resolve<IAnimalRepository>("animalRepository");

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.jane);
        await userRepository.save(UnitUser.modette);

        await animalRepository.save(UnitAnimal.puppy);
        await animalRepository.save(UnitAnimal.noona);
        await animalRepository.save(UnitAnimal.carpette);

        searchUserOrPetUseCase = new SearchUserOrPetUseCase(userRepository, animalRepository);
    })

    it("Should return empty results if there is less than 2 characters", async () => {
        const result = await searchUserOrPetUseCase.execute("a");
        expect(result.users).toHaveLength(0);
        expect(result.animals).toHaveLength(0);
    });

    it("Should return empty results if query is empty", async () => {
        const result = await searchUserOrPetUseCase.execute("");
        expect(result.users).toHaveLength(0);
        expect(result.animals).toHaveLength(0);
    });

    it("Should return an empty result if nothing match criteria", async () => {
        const result = await searchUserOrPetUseCase.execute("zzzz");
        expect(result.users).toHaveLength(0);
        expect(result.animals).toHaveLength(0);
    });

    it("Should return matching users by firstName", async () => {
        const result = await searchUserOrPetUseCase.execute("John");
        expect(result.users).toHaveLength(1);
        expect(result.users[0].firstName).toBe("John");
        expect(result.animals).toHaveLength(0);
    });

    it("Should return matching users by name", async () => {
        const result = await searchUserOrPetUseCase.execute("Doe");
        expect(result.users).toHaveLength(3);
        expect(result.users[0].name).toBe("Doe");
    });

    it("Should return matching animals by name", async () => {
        const result = await searchUserOrPetUseCase.execute("Noona");
        expect(result.animals).toHaveLength(1);
        expect(result.animals[0].name).toBe("Noona");
        expect(result.users).toHaveLength(0);
    });

    it("Should return both users and animals when query matches both", async () => {
        const result = await searchUserOrPetUseCase.execute("ette");
        expect(result.users.length).toBeGreaterThan(0);
        expect(result.animals.length).toBeGreaterThan(0);
        expect(result.animals[0].name).toBe("Carpette");
        expect(result.users[0].firstName).toBe("Modette");
    });

    it("Should be case insensitive", async () => {
        const lower = await searchUserOrPetUseCase.execute("john");
        const upper = await searchUserOrPetUseCase.execute("JOHN");
        expect(lower.users).toHaveLength(upper.users.length);
    });
})