import { describe, it, expect } from "vitest";
import { Argon2Services } from "../../../infrastructure/auth/argon2Services.js";
import { UnitUser } from "../../seeds/unit-user";

describe("Argon2Services", () => {
    const argon2Services = new Argon2Services();

    describe("interface compliance", () => {
        it("should implement IPasswordServices interface correctly", () => {
            expect(argon2Services.hashPassword).toBeDefined();
            expect(argon2Services.verifyPassword).toBeDefined();
            expect(typeof argon2Services.hashPassword).toBe("function");
            expect(typeof argon2Services.verifyPassword).toBe("function");
        });
    });

    describe("hashPassword", () => {
        it("should hash a password successfully", async () => {
            const plainPassword = "testPassword123";

            const hashedPassword = await argon2Services.hashPassword(plainPassword);

            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe("string");
            expect(hashedPassword).not.toBe(plainPassword);
            expect(hashedPassword.length).toBeGreaterThan(0);
            expect(hashedPassword).toMatch(/^\$argon2id\$/);
        });

        it("should generate different hashes for the same password", async () => {
            const plainPassword = "samePassword123";

            const hash1 = await argon2Services.hashPassword(plainPassword);
            const hash2 = await argon2Services.hashPassword(plainPassword);

            expect(hash1).not.toBe(hash2);
            expect(hash1).toMatch(/^\$argon2id\$/);
            expect(hash2).toMatch(/^\$argon2id\$/);
        });

        it("should handle special characters in password", async () => {
            const specialPassword = "!@#$%^&*()_+-=[]{}|;:,.<>?";

            const hashedPassword = await argon2Services.hashPassword(specialPassword);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).toMatch(/^\$argon2id\$/);
        });
    });

    describe("verifyPassword", () => {
        it("should verify a correct password", async () => {
            const plainPassword = "correctPassword123";
            const hashedPassword = await argon2Services.hashPassword(plainPassword);

            const isValid = await argon2Services.verifyPassword(plainPassword, hashedPassword);

            expect(isValid).toBe(true);
        });

        it("should reject an incorrect password", async () => {
            const correctPassword = "correctPassword123";
            const wrongPassword = "wrongPassword456";
            const hashedPassword = await argon2Services.hashPassword(correctPassword);

            const isValid = await argon2Services.verifyPassword(wrongPassword, hashedPassword);

            expect(isValid).toBe(false);
        });

        it("should verify password with existing hash from UnitUser", async () => {
            const plainPassword = "Password!123";
            const existingHash = UnitUser.john.password;

            const isValid = await argon2Services.verifyPassword(plainPassword, existingHash);

            expect(isValid).toBe(true);
        });

        it("should handle empty password verification", async () => {
            const emptyPassword = "";

            await expect(argon2Services.hashPassword(emptyPassword)).rejects.toThrow("Password is not valid");
        });

        it("should handle malformed hash", async () => {
            const plainPassword = "testPassword";
            const malformedHash = "not-a-valid-hash";

            await expect(
                argon2Services.verifyPassword(plainPassword, malformedHash)
            ).resolves.toBe(false);
        });

        it("should be case sensitive", async () => {
            const password = "TestPassword123";
            const hashedPassword = await argon2Services.hashPassword(password);

            const validLowerCase = await argon2Services.verifyPassword("testpassword123", hashedPassword);
            const validUpperCase = await argon2Services.verifyPassword("TESTPASSWORD123", hashedPassword);
            const validOriginal = await argon2Services.verifyPassword(password, hashedPassword);

            expect(validLowerCase).toBe(false);
            expect(validUpperCase).toBe(false);
            expect(validOriginal).toBe(true);
        });
    });
});