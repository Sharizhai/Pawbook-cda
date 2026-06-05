import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {PasswordUpdateDto} from "$presentation/dto/validation";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";
import {UpdatePasswordUseCase} from "$application/use-cases/password/UpdatePasswordUseCase";

describe("Use case: User wants to update his password", () => {
    let updatePasswordUseCase: UpdatePasswordUseCase;
    let passwordServices: IPasswordServices;
    let userRepository: IUserRepository;

    let validPasswordData: PasswordUpdateDto;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        passwordServices = c.resolve<IPasswordServices>("argon2Services");

        updatePasswordUseCase = new UpdatePasswordUseCase(userRepository, passwordServices);

        validPasswordData = {
            currentPassword: "Password!123",
            newPassword: "Drowssap?321"
        }

        await userRepository.save(UnitUser.john);
    })

    it("Should return an error if no user with this id is found", async () => {
        const nonExistentUserId = "non-existing-user-id";

        await expect(updatePasswordUseCase.execute(nonExistentUserId, validPasswordData)).rejects.toThrow("User not found");
    });

    it("Should throw an error if user id is missing", async () => {
        const emptyUserId = "";

        await expect(updatePasswordUseCase.execute(emptyUserId, validPasswordData)).rejects.toThrow("User ID is required");
    });

    it("Should return an error if actual password is incorrect", async () => {
        const wrongCurrentPassword = {
            currentPassword: "WrongPassword?123",
            newPassword: "Drowssap?321"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, wrongCurrentPassword)).rejects.toThrow("Invalid password");
    });

    it("Should return an error if new password is the same than the old one", async () => {
        const samePasswords = {
            currentPassword: "Password!123",
            newPassword: "Password!123"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, samePasswords)).rejects.toThrow("New password must be different from current password");
    });

    it("Should return an error if new password is too short", async () => {
        const shortPassword = {
            currentPassword: "Password!123",
            newPassword: "Pas!1"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, shortPassword)).rejects.toThrow("Password must be at least 12 characters long");
    });

    it("Should return an error if new password doesn't have an uppercase letter", async () => {
        const noUppercasePassword = {
            currentPassword: "Password!123",
            newPassword: "password!123"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, noUppercasePassword)).rejects.toThrow("Password must contain at least one uppercase letter");
    });

    it("Should return an error if new password doesn't have an lowercase letter", async () => {
        const noLowercasePassword = {
            currentPassword: "Password!123",
            newPassword: "PASSWORD!123"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, noLowercasePassword)).rejects.toThrow("Password must contain at least one lowercase letter");
    });

    it("Should return an error if new password doesn't have a number", async () => {
        const noNumberPassword = {
            currentPassword: "Password!123",
            newPassword: "Password!Pass"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, noNumberPassword)).rejects.toThrow("Password must contain at least one number");
    });

    it("Should return an error if new password doesn't have a special character", async () => {
        const noNumberPassword = {
            currentPassword: "Password!123",
            newPassword: "Password1234"
        };

        await expect(updatePasswordUseCase.execute(UnitUser.john.id, noNumberPassword)).rejects.toThrow("Password must contain at least one special character");
    });

    it("Should update user password", async () => {
        await expect(updatePasswordUseCase.execute(UnitUser.john.id, validPasswordData)).resolves.not.toThrow();

        const updatedUser = await userRepository.findById(UnitUser.john.id);
        const isPasswordUpdated = await passwordServices.verifyPassword(validPasswordData.newPassword, updatedUser!.password);

        expect(isPasswordUpdated).toBe(true);
    });
})