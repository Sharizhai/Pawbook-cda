import { IUserRepository } from "$domain/interfaces/userRepository.interface";
import { AuthController } from "$presentation/controllers/authController";
import { IAuthServices } from "$domain/interfaces/authServices.interface";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { LoginDto } from "$presentation/dto/validation";
import container from "$config/dependencyInjection";
import { UnitUser } from "../../seeds/unit-user";
import { User } from "$domain/entities/Users";
import { Container } from "$types/container";
import { Request, Response } from "express";

const createMockReq = (body?: any, cookies?: any, user?: User): Partial<Request> => ({
    body,
    cookies,
    user,
});

const createMockRes = (): Partial<Response> => {
    const res: any = {
        statusCode: 200,
        jsonData: null,
        cookieData: null,
        cookieOptions: null,
        clearedCookie: null,
        clearedCookieOptions: null,
        headers: {},
        status: function(code: number) {
            this.statusCode = code;
            return this;
        },
        json: function(data: any) {
            this.jsonData = data;
            return this;
        },
        cookie: function(name: string, value: string, options?: any) {
            this.cookieData = { name, value };
            this.cookieOptions = options;
            return this;
        },
        clearCookie: function(name: string, options?: any) {
            this.clearedCookie = name;
            this.clearedCookieOptions = options;
            return this;
        },
        setHeader: function(name: string, value: string) {
            this.headers[name] = value;
            return this;
        }
    };
    return res;
};

describe("AuthController", () => {
    let authController: AuthController;
    let authServices: IAuthServices;
    let userRepository: IUserRepository;
    let validTestToken: string;
    let mockReq: Partial<Request>;
    let mockRes: any;

    beforeAll(async () => {
        const c: Container = container;
        authServices = c.resolve<IAuthServices>("authServices");
        userRepository = c.resolve<IUserRepository>("userRepository");

        authController = new AuthController(authServices);

        await userRepository.save(UnitUser.john);

        const validCredentials: LoginDto = {
            email: UnitUser.john.email,
            password: "Password!123"
        };

        validTestToken = await authServices.login(validCredentials);
    });

    beforeEach(() => {
        mockReq = createMockReq();
        mockRes = createMockRes();
    });

    describe("1/ Login", () => {
        it("should return 401 when email is missing", async () => {
            mockReq.body = { email: "", password: "Password!123" };

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.jsonData).toEqual({
                data: null,
                message: "Identifiants invalides",
                success: false,
            });
        });

        it("should return 401 when password is missing", async () => {
            mockReq.body = { email: UnitUser.john.email, password: "" };

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.jsonData).toEqual({
                success: false,
                message: "Identifiants invalides",
                data: null,
            });
        });

        it("should return 401 when user is not found", async () => {
            mockReq.body = {
                email: "unknown@example.com",
                password: "Password!123"
            };

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.jsonData).toEqual({
                success: false,
                message: "Identifiants invalides",
                data: null,
            });
        });

        it("should return 401 when password is incorrect", async () => {
            mockReq.body = {
                email: UnitUser.john.email,
                password: "wrongpassword"
            };

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.jsonData).toEqual({
                success: false,
                message: "Identifiants invalides",
                data: null,
            });
        });

        it("should return 200 with token when credentials are valid", async () => {
            mockReq.body = {
                email: UnitUser.john.email,
                password: "Password!123"
            };

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.cookieData.name).toBe('jwt');
            expect(mockRes.cookieData.value).toBeDefined();
            expect(mockRes.cookieOptions).toEqual({
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000,
                domain: 'localhost',
            });
            expect(mockRes.jsonData).toEqual({
                success: true,
                message: 'Connexion réussie',
                data: { token: mockRes.cookieData.value },
            });
        });
    });

    describe("2/ Logout", () => {
        it("should return 200 and clear cookie when logout is successful with token", async () => {
            mockReq.cookies = { jwt: validTestToken };

            await authController.logout(mockReq as Request, mockRes as Response);

            expect(mockRes.clearedCookie).toBe('jwt');
            expect(mockRes.clearedCookieOptions).toEqual({
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                domain: 'localhost',
            });
            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.jsonData).toEqual({
                success: true,
                message: "Déconnexion réussie",
                data: null,
            });
        });

        it("should return 200 and clear cookie when no token is present", async () => {
            mockReq.cookies = {};

            await authController.logout(mockReq as Request, mockRes as Response);

            expect(mockRes.clearedCookie).toBe('jwt');
            expect(mockRes.clearedCookieOptions).toEqual({
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                domain: 'localhost',
            });
            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.jsonData).toEqual({
                success: true,
                message: "Déconnexion réussie",
                data: null,
            });
        });
    });

    describe("3/ Me", () => {
        it("should return 401 when user is not authenticated (no user in req)", async () => {
            mockReq.user = undefined;

            await authController.me(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.jsonData).toEqual({
                success: false,
                message: "Non authentifié",
                data: null,
            });
        });

        it("should return 200 with user data when user is authenticated", async () => {
            const user = await userRepository.findById(UnitUser.john.id);
            mockReq.user = user || undefined;

            await authController.me(mockReq as Request, mockRes as Response);

            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.jsonData).toEqual({
                success: true,
                message: "Utilisateur récupéré avec succès",
                data: user!.toJSON(),
            });
            expect(mockRes.jsonData.data.id).toBe(UnitUser.john.id);
            expect(mockRes.jsonData.data.name).toBe(UnitUser.john.name);
        });
    });
});