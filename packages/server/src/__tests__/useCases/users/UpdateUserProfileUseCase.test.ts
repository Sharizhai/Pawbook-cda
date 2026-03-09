import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {UserUpdateDto} from "$presentation/dto/validation";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";
import {UpdateUserProfileUseCase} from "$application/use-cases/user/UpdateUserProfileUseCase";

describe("Use case: ", () => {
    let updateUserProfileUseCase: UpdateUserProfileUseCase;
    let userRepository: IUserRepository;

    let validUpdateUserData: UserUpdateDto;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");

        updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

        validUpdateUserData = {
            profilePicture: "btk6dctgykvujhgsrjir",
            profileDescription: "J'ai changé ma description en mieux"
        };

        await userRepository.save(UnitUser.john);
    })

    it("Should return an error if no user with this id is found", async () => {
        const nonExistentUserId = "non-existing-user-id";

        await expect(updateUserProfileUseCase.execute(nonExistentUserId, validUpdateUserData)).rejects.toThrow("User not found");
    });

    it("Should throw an error if user id is missing", async () => {
        const emptyUserId = "";

        await expect(updateUserProfileUseCase.execute(emptyUserId, validUpdateUserData)).rejects.toThrow("User ID is required");
    });

    it("Should throw an error if profileDescription is longer than 150 characters", async () => {
        const veryLongDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nunc nisl eget aliquam. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nunc nisl eget aliquam.";

        await expect(updateUserProfileUseCase.execute(UnitUser.john.id, {profileDescription: veryLongDescription})).rejects.toThrow("The description must not exceed 150 characters.");
    });

    it("Should update an existing user with valid datas", async () => {
        const validUserId = UnitUser.john.id;

        const result = await updateUserProfileUseCase.execute(validUserId, validUpdateUserData);

        expect(result).toHaveProperty("id", validUserId);
        expect(result).toHaveProperty("profilePicture", validUpdateUserData.profilePicture);
        expect(result).toHaveProperty("profileDescription", validUpdateUserData.profileDescription);
    });
})