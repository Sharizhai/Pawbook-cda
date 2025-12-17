import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";
import {GetUserByIdUseCase} from "$application/use-cases/user/GetUserByIdUseCase";

describe("Use case: we should be able to get user informations with a user id", () => {
    let userRepository: IUserRepository;
    let getUserByIdUseCase: GetUserByIdUseCase;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");

        getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

        await userRepository.save(UnitUser.john);
    })

    it("Should return an error if no user with this id is found", async () => {
        const nonExistentUserId = "non-existing-user-id";

        await expect(getUserByIdUseCase.execute(nonExistentUserId)).rejects.toThrow("User not found");
    });

    it("Should throw an error if user id is missing", async () => {
        const emptyUserId = "";

        await expect(getUserByIdUseCase.execute(emptyUserId)).rejects.toThrow("User ID is required");
    });

    it("Should return a user if one is found", async () => {
        const user = await getUserByIdUseCase.execute(UnitUser.john.id);

        expect(user).toBeDefined();
        expect(user.name).toBe(UnitUser.john.name);
        expect(user.firstName).toBe(UnitUser.john.firstName);
        expect(user.profilePicture).toBeDefined();
        expect(user.profileDescription).toBeDefined();
        expect(user.memberSince).toBeInstanceOf(Date);
    });

    it("Should return non sensitive informations only : name, firstName, profilePicture & profileDescription", async () => {
        const user = await getUserByIdUseCase.execute(UnitUser.john.id);

        expect(user.name).toBeDefined();
        expect(user.firstName).toBeDefined();
        expect(user.profilePicture).toBeDefined();
        expect(user.profileDescription).toBeDefined();

        expect(user).not.toHaveProperty("password");
        expect(user).not.toHaveProperty("email");
        expect(user).not.toHaveProperty("refreshToken");
    });
})