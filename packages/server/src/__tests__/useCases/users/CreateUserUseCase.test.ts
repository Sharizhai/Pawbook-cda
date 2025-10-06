import {beforeAll, describe, it, expect} from "vitest";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {Container} from "$types/container";
import container from "$config/dependencyInjection";
import {DateHelper} from "$utils/dateUtils.utils";
import {UnitUser} from "../../seeds/unit-user";

describe("Usecase : We should be able to create a new user", () => {
    let userRepository: IUserRepository;
    let createUserUseCase: CreateUserUseCase;
    let validUserData: UserCreationDto;

    beforeAll(async () => {
        const c: Container = container;
        userRepository = c.resolve<IUserRepository>("userRepository");

        await userRepository.save(UnitUser.jane);

        createUserUseCase = new CreateUserUseCase(userRepository);

        validUserData = {
            name: "Doe",
            firstName: "John",
            email: "john.doe@johndoe.com",
            password: "Password!123",
            role: "USER",
            posts: [],
            animals: [],
            follows: [],
            followers: [],
            createdAt: DateHelper.daysAgo(30),
            updatedAt: "",
            profileDescription: "Salut, moi c'est John !",
            profilePicture: "",
            refreshToken: "",
        }
    })

    it("Should return an error if firstName is missing", async () => {
        const invalidData = {
            firstName: "",
            name: "Doe",
            email: "john.doe@test.com",
            password: "Password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le prénom est requis");
    });

    it("Should return an error if name is missing", async () => {
        const invalidData = {
            firstName: "John",
            name: "",
            email: "john.doe@test.com",
            password: "Password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le nom est requis");
    });

    it("Should return an error if email is invalid", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "Password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Adresse e-mail invalide");
    });

    it("Should return an error if password is too short", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "Pass!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le mot de passe doit faire au moins 12 caractères");
    });

    it("Should return an error if password doesn't have an uppercase letter", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le mot de passe doit contenir au moins une majuscule");
    });

    it("Should return an error if password doesn't have an lowercase letter", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "PASSWORD!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le mot de passe doit contenir au moins une minuscule");
    });

    it("Should return an error if password doesn't have a number", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "password!pass",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le mot de passe doit contenir au moins un chiffre");
    });

    it("Should return an error if password doesn't have a special character", async () => {
        const invalidData = {
            firstName: "John",
            name: "Doe",
            email: "invalid-email",
            password: "passwordi123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Le mot de passe doit contenir au moins un caractère spécial");
    });

    it("Should return an error if email already exist", async () => {
        const invalidData = {
            firstName: "Jane",
            name: "Doe",
            email: "jane.doe@janedoe.com",
            password: "Password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(invalidData);

        expect(result.success).toBe(false);
        expect(result.message).toBe("Cette adresse email n'est pas autorisée");
    });

    it("Should trim and normalize user data before saving", async () => {
        const dataWithSpaces = {
            firstName: "  John  ",
            name: "  Doe  ",
            email: "  john.doe@test.com  ",
            password: "Password!123",
        } as UserCreationDto;

        const result = await createUserUseCase.execute(dataWithSpaces);

        expect(result.success).toBe(true);
        expect(result.data?.firstName).toBe("John");
        expect(result.data?.name).toBe("Doe");
        expect(result.data?.email).toBe("john.doe@test.com");
    });

    it("Should lowercase the email before saving", async () => {
        const data = { ...validUserData, email: "John.Doe@Test.com" };
        const result = await createUserUseCase.execute(data);

        expect(result.data?.email).toBe("john.doe@test.com");
    });

    it("Should create a new user with valid datas", async () => {
        const result = await createUserUseCase.execute(validUserData);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.id).toBeDefined();
        expect(result.data?.email).toBe("john.doe@test.com");
        expect(result.data?.firstName).toBe("John");
        expect(result.data?.name).toBe("Doe");
        expect(result.data?.password).not.toBe("Password!123");
        expect(result.data?.role).toBe("USER");
        expect(result.data?.createdAt).toBeDefined();
    });

    it("Should not return password in user data", async () => {
        const result = await createUserUseCase.execute(validUserData);

        expect(result.success).toBe(true);
        const userJson = result.data;
        expect(userJson).not.toHaveProperty('password');
    });
})