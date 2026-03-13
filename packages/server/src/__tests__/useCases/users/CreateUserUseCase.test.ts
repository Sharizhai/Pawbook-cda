import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {CreateUserUseCase} from "$application/use-cases/user/CreateUserUseCase";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {IEmailServices} from "$domain/interfaces/emailServices.interface";
import {UserCreationDto} from "$presentation/dto/validation";
import {beforeAll, describe, it, expect} from "vitest";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";

describe("Usecase : We should be able to create a new user", () => {
    let createUserUseCase: CreateUserUseCase;
    let passwordServices: IPasswordServices;
    let emailServices: IEmailServices;
    let userRepository: IUserRepository;
    let validUserData: UserCreationDto;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");
        passwordServices = c.resolve<IPasswordServices>("argon2Services");
        emailServices = c.resolve<IEmailServices>("emailServices");

        await userRepository.save(UnitUser.jane);

        createUserUseCase = new CreateUserUseCase(userRepository, passwordServices, emailServices);

        validUserData = {
            name: "Doe",
            firstName: "John",
            email: "john.doe@johndoe.com",
            password: "Password!123",
            role: "USER",
            profileDescription: "Salut, moi c'est John !",
            profilePicture: "",
        }
    })

    it("Should return an error if firstName is missing", async () => {
        const invalidData = {
            firstName: "",
            name: "Doe",
            email: "john.doe@test.com",
            password: "Password!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le prénom est requis");
    });

    it("Should return an error if name is missing", async () => {
        const invalidData = {
            firstName: "John",
            name: "",
            email: "john.doe@test.com",
            password: "Password!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le nom est requis");
    });

    it("Should return an error if email is invalid", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "Password!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Adresse e-mail invalide");
    });

    it("Should return an error if password is too short", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "john.doe@test.com",
            password: "Pass!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le mot de passe doit faire au moins 12 caractères");
    });

    it("Should return an error if password doesn't have an uppercase letter", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "john.doe@test.com",
            password: "password!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le mot de passe doit contenir au moins une majuscule");
    });

    it("Should return an error if password doesn't have an lowercase letter", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "john.doe@test.com",
            password: "PASSWORD!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le mot de passe doit contenir au moins une minuscule");
    });

    it("Should return an error if password doesn't have a number", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "john.doe@test.com",
            password: "password!pass",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le mot de passe doit contenir au moins un chiffre");
    });

    it("Should return an error if password doesn't have a special character", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "john.doe@test.com",
            password: "passwordi123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Le mot de passe doit contenir au moins un caractère spécial");
    });

    it("Should return an error if email already exist", async () => {
        const invalidData = {
            firstName: "Jane",
            name: "Doe",
            email: "jane.doe@janedoe.com",
            password: "Password!123",
        } as UserCreationDto;

        await expect(createUserUseCase.execute(invalidData)).rejects.toThrow("Cette adresse email existe déjà");
    });

    it("Should trim and normalize user data before saving", async () => {
        const dataWithSpaces = {
            firstName: "  John  ",
            name: "  Doe  ",
            email: "  john.doe@test.com  ",
            password: "Password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(dataWithSpaces);

        expect(result.firstName).toBe("John");
        expect(result.name).toBe("Doe");
        expect(result.email).toBe("john.doe@test.com");
    });

    it("Should lowercase the email before saving", async () => {
        const data = {
            ...validUserData,
            email: "Uppercase.Test@Example.com" // Email unique
        };
        const result = await createUserUseCase.execute(data);

        expect(result.email).toBe("uppercase.test@example.com");
    });

    it("Should create a new user with valid datas", async () => {
        const user = await createUserUseCase.execute(validUserData);

        expect(user).toBeDefined();
        expect(user.name).toBe("Doe");
        expect(user.firstName).toBe("John");
        expect(user.email).toBe("john.doe@johndoe.com");
        expect(user.role).toBe("USER");
        expect(user.profileDescription).toBe("Salut, moi c'est John !");
        expect(user.profilePicture).toBe("");
    });

    it("Should not return password in user data", async () => {
        const uniqueData = {
            ...validUserData,
            email: "unique@test.com" // Email unique
        };

        const result = await createUserUseCase.execute(uniqueData);
        const userJson = result.toJSON ? result.toJSON() : result;

        expect(userJson).not.toHaveProperty("password");
    });
})