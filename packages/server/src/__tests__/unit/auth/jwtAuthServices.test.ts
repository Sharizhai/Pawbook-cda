import {IJwtServices} from "$domain/interfaces/jwtServices.interface";
import {ITokenPayload} from "$domain/interfaces/tokenPayload.interface";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import container from "$config/dependencyInjection";
import {Container} from "$types/container";
import jwt from "jsonwebtoken";

describe("JwtAuthService (via DI)", () => {
    let jwtAuthService: IJwtServices;

    const validPayload: ITokenPayload = {
        id: "67164a84291bcc737b9a7e3a",
        email: "john.doe@johndoe.com",
        firstName: "John",
        name: "Doe",
        role: "USER",
    };

    beforeAll(() => {
        const c: Container = container;
        jwtAuthService = c.resolve<IJwtServices>("jwtAuthService");
    });

    beforeEach(() => {
        expect(process.env.JWT_SECRET || "").not.toBe("");
        expect(process.env.JWT_EXPIRATION_SECRET || "").not.toBe("");
    });

    describe("generateToken", () => {
        it("should throw with null/undefined payload", () => {
            expect(() => jwtAuthService.generateToken(null as any)).toThrow();
            expect(() => jwtAuthService.generateToken(undefined as any)).toThrow();
        });

        it("should generate a valid token with proper payload", () => {
            const token = jwtAuthService.generateToken(validPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3);
        });

        it("should generate different tokens for the same payload", () => {
            const token1 = jwtAuthService.generateToken(validPayload);
            const token2 = jwtAuthService.generateToken(validPayload);

            expect(token1).not.toBe(token2);
        });

        it("should include expiration in token", () => {
            const token = jwtAuthService.generateToken(validPayload);
            const decoded = jwt.decode(token) as any;

            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
            expect(decoded.exp > decoded.iat).toBe(true);
        });
    });

    describe("verifyToken", () => {
        it("should fail with empty token", () => {
            expect(() => jwtAuthService.verifyToken("")).toThrow();
        });

        it("should fail with malformed token", () => {
            const malformedTokens = [
                "not-a-jwt-token",
                "invalid.jwt",
                "too.many.parts.here.invalid",
            ];

            malformedTokens.forEach((invalidToken) => {
                expect(() => jwtAuthService.verifyToken(invalidToken)).toThrow();
            });
        });

        it("should fail with expired token", () => {
            const expiredToken = jwt.sign(
                { payload: validPayload },
                process.env.JWT_SECRET || "test-secret",
                { expiresIn: "-1h" }
            );

            expect(() => jwtAuthService.verifyToken(expiredToken)).toThrow();
        });

        it("should fail with token signed with wrong secret", () => {
            const wrongSecretToken = jwt.sign(
                { payload: validPayload },
                "wrong-secret"
            );

            expect(() => jwtAuthService.verifyToken(wrongSecretToken)).toThrow();
        });

        it("should successfully verify a valid token", () => {
            const token = jwtAuthService.generateToken(validPayload);
            const decoded = jwtAuthService.verifyToken(token);

            expect(decoded.id).toBe(validPayload.id);
            expect(decoded.email).toBe(validPayload.email);
            expect(decoded.firstName).toBe(validPayload.firstName);
            expect(decoded.name).toBe(validPayload.name);
            expect(decoded.role).toBe(validPayload.role);
        });
    });

    describe("generateRefreshToken", () => {
        it("should throw with null/undefined payload", () => {
            expect(() => jwtAuthService.generateRefreshToken(null as any)).toThrow();
            expect(() => jwtAuthService.generateRefreshToken(undefined as any)).toThrow();
        });

        it("should generate a valid refresh token with proper payload", () => {
            const refreshPayload = { id: validPayload.id };
            const token = jwtAuthService.generateRefreshToken(refreshPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3);
        });

        it("should generate different refresh tokens for the same payload", () => {
            const refreshPayload = { id: validPayload.id };
            const token1 = jwtAuthService.generateRefreshToken(refreshPayload);
            const token2 = jwtAuthService.generateRefreshToken(refreshPayload);

            expect(token1).not.toBe(token2);
        });
    });

    describe("verifyRefreshToken", () => {
        it("should fail with empty token", () => {
            expect(() => jwtAuthService.verifyRefreshToken("")).toThrow();
        });

        it("should fail with malformed token", () => {
            const malformedTokens = [
                "not-a-jwt-token",
                "invalid.jwt",
                "too.many.parts.here.invalid",
            ];

            malformedTokens.forEach((invalidToken) => {
                expect(() => jwtAuthService.verifyRefreshToken(invalidToken)).toThrow();
            });
        });

        it("should fail with expired refresh token", () => {
            const expiredToken = jwt.sign(
                { id: validPayload.id },
                process.env.REFRESH_TOKEN_SECRET || "test-refresh-secret",
                { expiresIn: "-1h" }
            );

            expect(() => jwtAuthService.verifyRefreshToken(expiredToken)).toThrow();
        });

        it("should fail with token signed with wrong secret", () => {
            const wrongSecretToken = jwt.sign(
                { id: validPayload.id },
                "wrong-secret"
            );

            expect(() => jwtAuthService.verifyRefreshToken(wrongSecretToken)).toThrow();
        });

        it("should fail when verifying refresh token with access token secret", () => {
            const refreshPayload = { id: validPayload.id };
            const refreshToken = jwtAuthService.generateRefreshToken(refreshPayload);

            expect(() => jwtAuthService.verifyToken(refreshToken)).toThrow();
        });

        it("should successfully verify a valid refresh token", () => {
            const refreshPayload = { id: validPayload.id };
            const refreshToken = jwtAuthService.generateRefreshToken(refreshPayload);
            const decoded = jwtAuthService.verifyRefreshToken(refreshToken);

            expect(decoded.id).toBe(validPayload.id);
        });
    });

    describe("extractTokenFromHeader", () => {
        it("should return null for empty or invalid headers", () => {
            const invalidHeaders = ["", "Basic token", "Bearer", "Bearer "];

            invalidHeaders.forEach((header) => {
                const result = jwtAuthService.extractTokenFromHeader(header);
                expect(result).toBeNull();
            });
        });

        it("should extract token from valid Bearer header", () => {
            const token = jwtAuthService.generateToken(validPayload);
            const header = `Bearer ${token}`;
            const extracted = jwtAuthService.extractTokenFromHeader(header);

            expect(extracted).toBe(token);
        });
    });
});
