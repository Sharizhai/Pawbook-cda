import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {makeAuthMiddleware} from "$presentation/middlewares/authMiddleware";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {IJwtServices} from "$domain/interfaces/jwtServices.interface";
import {beforeAll, describe, it, vi, expect} from "vitest";
import {LoginDto} from "$presentation/dto/validation";
import container from "$config/dependencyInjection";
import {UnitUser} from "../../seeds/unit-user";
import {NextFunction, Request} from "express";
import {Container} from "$types/container";

describe("Auth middleware", () => {
    let authServices: IAuthServices;
    let userRepository: IUserRepository;
    let jwtAuthServices: IJwtServices;
    let validTestToken: string;
    let authMiddleware: ReturnType<typeof makeAuthMiddleware>;

    beforeAll(async () => {
        const c: Container = container;
        authServices = c.resolve<IAuthServices>("authServices");
        userRepository = c.resolve<IUserRepository>("userRepository");
        jwtAuthServices = c.resolve<IJwtServices>("jwtAuthService");
        authMiddleware = makeAuthMiddleware(authServices, userRepository);

        await userRepository.save(UnitUser.john);
        await userRepository.save(UnitUser.loly);
        await userRepository.save(UnitUser.modette);

        const validCredentials: LoginDto = {
            email: UnitUser.john.email,
            password: "Password!123"
        };

        validTestToken = await authServices.login(validCredentials);
    });

    interface MockResponse {
        statusCode: number;
        jsonData: any;
        cookieData: any;
        cookieOptions: any;
        clearedCookie: any;
        clearedCookieOptions: any;
        status: (code: number) => MockResponse;
        json: (data: any) => MockResponse;
        cookie: (name: string, value: string, options?: any) => MockResponse;
        clearCookie: (name: string, options?: any) => MockResponse;
    }

    const createMockObjects = () => {
        const req = {
            headers: {},
            params: {},
            user: undefined
        } as Partial<Request> as Request;

        const res: MockResponse = {
            statusCode: 200,
            jsonData: null,
            cookieData: null,
            cookieOptions: null,
            clearedCookie: null,
            clearedCookieOptions: null,
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
            }
        };

        const next = vi.fn() as NextFunction;

        return { req, res, next };
    };

    describe("1/ isAuthenticated", () => {
        it("Should return an error if no user found", async () => {
            const { req, res, next } = createMockObjects();

            const fakeToken = jwtAuthServices.generateToken({
                id: "fake-user-id",
                email: "fake@test.com",
                firstName: "Fake",
                name: "User",
                role: "USER"
            });
            req.headers.authorization = `Bearer ${fakeToken}`;

            await authMiddleware.isAuthenticated(req, res as any, next);

            expect(res.statusCode).toBe(401);
            expect(res.jsonData).toEqual({
                success: false,
                message: "User not found",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return an error if no valid token", async () => {
            const { req, res, next } = createMockObjects();
            req.headers.authorization = "Bearer invalid-token";

            await authMiddleware.isAuthenticated(req, res as any, next);

            expect(res.statusCode).toBe(401);
            expect(res.jsonData.success).toBe(false);
            expect(res.jsonData.message).toBe("Unauthorized - Invalid token");
            expect(res.jsonData.data).toBeDefined();
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return an error if no authHeader", async () => {
            const { req, res, next } = createMockObjects();

            await authMiddleware.isAuthenticated(req, res as any, next);

            expect(res.statusCode).toBe(401);
            expect(res.jsonData).toEqual({
                success: false,
                message: "Unauthorized - Authentication token required",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return an error if authHeader don't start with Bearer", async () => {
            const { req, res, next } = createMockObjects();
            req.headers.authorization = "Basic some-token";

            await authMiddleware.isAuthenticated(req, res as any, next);

            expect(res.statusCode).toBe(401);
            expect(res.jsonData).toEqual({
                success: false,
                message: "Unauthorized - Authentication token required",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return the user if found then next", async () => {
            const { req, res, next } = createMockObjects();
            req.headers.authorization = `Bearer ${validTestToken}`;

            await authMiddleware.isAuthenticated(req, res as any, next);

            expect(req.user).toBeDefined();
            expect(req.user?.id).toBe(UnitUser.john.id);
            expect(next).toHaveBeenCalled();
            expect(res.jsonData).toBeNull();
        });
    });

    describe("2/ isAdmin", () => {
        it("Should return an error if no user found", async () => {
            const { req, res, next } = createMockObjects();

            authMiddleware.isAdmin(req, res as any, next);

            expect(res.statusCode).toBe(401);
            expect(res.jsonData).toEqual({
                success: false,
                message: "Unauthorized",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return an error if the user is not an admin", async () => {
            const { req, res, next } = createMockObjects();

            const user = await userRepository.findById(UnitUser.john.id);
            req.user = user!;

            authMiddleware.isAdmin(req, res as any, next);

            expect(res.statusCode).toBe(403);
            expect(res.jsonData).toEqual({
                success: false,
                message: "Forbidden",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should go to the next step if the user is admin", async () => {
            const { req, res, next } = createMockObjects();

            const adminUser = await userRepository.findById(UnitUser.loly.id);
            req.user = adminUser!;

            authMiddleware.isAdmin(req, res as any, next);

            expect(next).toHaveBeenCalled();
            expect(res.jsonData).toBeNull()
        });
    });

    describe("3/ canModifyUser", () => {
        it("Should return an error if no user found", async () => {
            const { req, res, next } = createMockObjects();
            req.params.id = "some-user-id";

            authMiddleware.canModifyUser(req, res as any, next);

            expect(res.statusCode).toBe(401);
            expect(res.jsonData).toEqual({
                success: false,
                message: "Unauthorized",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should return an error if the user is not an admin or a moderator", async () => {
            const { req, res, next } = createMockObjects();

            const user = await userRepository.findById(UnitUser.john.id);
            req.user = user!;
            req.params.id = "67164a84291bcc737b9a7e3d";

            authMiddleware.canModifyUser(req, res as any, next);

            expect(res.statusCode).toBe(403);
            expect(res.jsonData).toEqual({
                success: false,
                message: "Forbidden",
                data: null
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("Should go to the next step if the user modify his own data", async () => {
            const { req, res, next } = createMockObjects();

            const user = await userRepository.findById(UnitUser.john.id);
            req.user = user!;
            req.params.id = UnitUser.john.id;

            authMiddleware.canModifyUser(req, res as any, next);

            expect(next).toHaveBeenCalled();
            expect(res.jsonData).toBeNull();
        });

        it("Should go to the next step if the user is admin or a moderator and modify an other user", async () => {
            const { req, res, next } = createMockObjects();

            const adminUser = await userRepository.findById(UnitUser.loly.id);
            req.user = adminUser!;
            req.params.id = UnitUser.john.id;

            authMiddleware.canModifyUser(req, res as any, next);

            expect(next).toHaveBeenCalled();
            expect(res.jsonData).toBeNull();
        });
    });
});