import {InMemoryUserRepository} from "$infrastructure/repositories/inMemoryUserRepository";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {describe, it, expect, beforeAll} from "vitest";
import {LoginDto} from "$presentation/dto/validation";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {Container} from "$types/container";
import jwt from "jsonwebtoken";

describe("Authentication Services", () => {
    let authServices: IAuthServices;
    let userRepository: IUserRepository;
    let validTestToken: string;

    beforeAll(async () => {
        const c: Container = container;
        authServices = c.resolve<IAuthServices>("authServices");
        userRepository = c.resolve<InMemoryUserRepository>("userRepository");

        await userRepository.save(UnitUser.john);

        const validCredentials: LoginDto = {
            email: UnitUser.john.email,
            password: "Password!123"
        };

        validTestToken = await authServices.login(validCredentials);
    })

    describe("1/ Login", () => {
        it("should return an error if email is missing", async () => {
            const invalidCredentials = { email: "", password: "password123" };

            await expect(authServices.login(invalidCredentials))
                .rejects
                .toThrow("E-mail et mot de passe requis");
        })

        it("should return an error if password is missing", async () => {
            const invalidCredentials2 = { email: UnitUser.john.email, password: "" };

            await expect(authServices.login(invalidCredentials2))
                .rejects
                .toThrow("E-mail et mot de passe requis");
        })

        it("should return an error if user is not found", async () => {
            const nonExistentUser: LoginDto = {
                email: "unknown@example.com",
                password: "password123"
            };

            await expect(authServices.login(nonExistentUser))
                .rejects
                .toThrow("Pas de compte trouvé pour cet e-mail");
        })

        it("should return an error if password is incorrect", async () => {
            const wrongPasswordCredentials: LoginDto = {
                email: UnitUser.john.email,
                password: "wrongpassword"
            };

            await expect(authServices.login(wrongPasswordCredentials))
                .rejects
                .toThrow("Mot de passe invalide");
        })

        it("should return a JWT token if credentials are correct", async () => {
            const payload = jwt.decode(validTestToken) as any;

            expect(payload.id).toBe(UnitUser.john.id);
            expect(payload.email).toBe(UnitUser.john.email);
            expect(payload.role).toBe("USER");
        })
    });

    describe("2/ Logout", () => {
        it("should handle logout with invalid token gracefully", async () => {
            const invalidToken = "invalid.token.here";

            await expect(authServices.logout(invalidToken)).resolves.toBeUndefined();
        });

        it("should handle logout with empty token gracefully", async () => {
            await expect(authServices.logout("")).resolves.toBeUndefined();
        });

        it("should logout successfully with valid token", async () => {
            await expect(authServices.logout(validTestToken)).resolves.toBeUndefined();
        });
    });

    describe("3/ verifyToken", () => {
        it("should return null for invalid token verification", () => {
            const invalidToken = "invalid.token.here";

            expect(authServices.verifyToken(invalidToken)).toBe(null);
        });

        it("should return null for empty token verification", () => {
            expect(authServices.verifyToken("")).toBe(null);
        });

        it("should verify a valid token and return correct payload", () => {
            const payload = authServices.verifyToken(validTestToken);

            expect(payload).toBeDefined();
            expect(payload!.id).toBe(UnitUser.john.id);
            expect(payload!.email).toBe(UnitUser.john.email);
            expect(payload!.firstName).toBe(UnitUser.john.firstName);
            expect(payload!.name).toBe(UnitUser.john.name);
            expect(payload!.role).toBe(UnitUser.john.role);
        });
    });

    describe("4/ isTokenValid", () => {
        it("should return false for invalid token verification", () => {
            const invalidToken = "invalid.token.here";

            expect(authServices.isTokenValid!(invalidToken)).toBe(false);
        });

        it("should return false for empty token", () => {
            const isValid = authServices.isTokenValid!("");

            expect(isValid).toBe(false);
        });

        it("should return true for valid token verification", () => {
            expect(authServices.isTokenValid!(validTestToken)).toBe(true);
        });
    });
});