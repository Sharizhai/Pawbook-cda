import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ServerTest } from "../serverTest";
import request from "supertest";
import { UserFixture } from "../fixtures/userFixture";
import { UnitUser } from "../seeds/unit-user";
import { Application } from "express";

describe("E2E: Authentication Flow", () => {
    let serverTest: ServerTest;
    let app: Application;

    beforeAll(async () => {
        serverTest = new ServerTest();
        await serverTest.setup();
        app = serverTest.expressApp;

        await serverTest.loadFixtures([
            new UserFixture(UnitUser.john),
            new UserFixture(UnitUser.jane),
            new UserFixture(UnitUser.loly),
            new UserFixture(UnitUser.modette)
        ]);
    });

    afterAll(async () => {
        await serverTest.teardown();
    });

    describe("POST /api/auth/login", () => {
        it("should return 401 when email is missing", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "", password: "Password!123" });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it("should return 401 when password is missing", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.john.email, password: "" });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it("should return 401 when user does not exist", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "nonexistent@example.com", password: "Password!123" });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it("should return 401 when password is incorrect", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.john.email, password: "WrongPassword!123" });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it("should return 200 with tokens when credentials are valid", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.john.email, password: "Password!123" });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Connexion réussie");
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data).toHaveProperty("refreshToken");
            expect(typeof response.body.data.token).toBe("string");
            expect(typeof response.body.data.refreshToken).toBe("string");

            const cookies = response.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();
            expect(cookies.length).toBeGreaterThanOrEqual(2);

            const accessTokenCookie = cookies.find((c: string) => c.startsWith('accessToken='));
            const refreshTokenCookie = cookies.find((c: string) => c.startsWith('refreshToken='));

            expect(accessTokenCookie).toBeDefined();
            expect(refreshTokenCookie).toBeDefined();
            expect(accessTokenCookie).toContain('HttpOnly');
            expect(refreshTokenCookie).toContain('HttpOnly');
            expect(accessTokenCookie).toContain('SameSite=Lax');
            expect(refreshTokenCookie).toContain('SameSite=Lax');
        });

        it("should trim and normalize email before login", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: `  ${UnitUser.john.email}  `, password: "Password!123" });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should accept email in any case (case insensitive)", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.john.email.toUpperCase(), password: "Password!123" });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should login successfully with different user roles", async () => {
            const userResponse = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.jane.email, password: "Password!123" });

            expect(userResponse.status).toBe(200);
            expect(userResponse.body.success).toBe(true);

            const adminResponse = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.loly.email, password: "Password!123" });

            expect(adminResponse.status).toBe(200);
            expect(adminResponse.body.success).toBe(true);

            const moderatorResponse = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.modette.email, password: "Password!123" });

            expect(moderatorResponse.status).toBe(200);
            expect(moderatorResponse.body.success).toBe(true);
        });
    });

    describe("GET /api/auth/me", () => {
        let validToken: string;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.john.email, password: "Password!123" });

            validToken = loginResponse.body.data.token;
        });

        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .get("/api/auth/me");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it("should return 401 when token is invalid", async () => {
            const response = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer invalid-token");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Unauthorized - Invalid token");
        });

        it("should return 401 when Authorization header format is incorrect", async () => {
            const response = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Basic some-token");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it("should return 200 with user data when token is valid", async () => {
            const response = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Utilisateur récupéré avec succès");
            expect(response.body.data).toBeDefined();

            const userData = response.body.data;

            expect(userData.id).toBe(UnitUser.john.id);
            expect(userData.firstName).toBe(UnitUser.john.firstName);
            expect(userData.name).toBe(UnitUser.john.name);
            expect(userData.role).toBe(UnitUser.john.role);

            expect(userData).not.toHaveProperty("password");
            expect(userData).not.toHaveProperty("refreshToken");
            expect(userData).not.toHaveProperty("email");
        });

        it("should return correct user data for different roles", async () => {
            const adminLogin = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.loly.email, password: "Password!123" });

            const adminToken = adminLogin.body.data.token;

            const adminMeResponse = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(adminMeResponse.status).toBe(200);

            const adminData = adminMeResponse.body.data;

            expect(adminData.id).toBe(UnitUser.loly.id);
            expect(adminData.role).toBe("ADMIN");
            expect(adminData.firstName).toBe(UnitUser.loly.firstName);
            expect(adminData.name).toBe(UnitUser.loly.name);

            expect(adminData).not.toHaveProperty("email");
        });
    });

    describe("POST /api/auth/logout", () => {
        let validToken: string;

        beforeAll(async () => {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.john.email, password: "Password!123" });

            validToken = loginResponse.body.data.token;
        });

        it("should return 200 and clear cookies on logout", async () => {
            const response = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", [`jwt=${validToken}`]);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            const cookies = response.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();

            const jwtCookie = cookies.find((c: string) => c.startsWith('jwt='));
            expect(jwtCookie).toBeDefined();
            expect(jwtCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/);
        });

        it("should return 200 even when no token is provided", async () => {
            const response = await request(app)
                .post("/api/auth/logout");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should return 200 even with invalid token", async () => {
            const response = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", [`jwt=invalid-token`]);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe("Full Authentication Flow", () => {
        it("should complete a full login -> me -> logout cycle", async () => {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({ email: UnitUser.jane.email, password: "Password!123" });

            expect(loginResponse.status).toBe(200);
            const token = loginResponse.body.data.token;

            const meResponse = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${token}`);

            expect(meResponse.status).toBe(200);
            expect(meResponse.body.data.id).toBe(UnitUser.jane.id);
            expect(meResponse.body.data.firstName).toBe(UnitUser.jane.firstName);

            const logoutResponse = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", [`jwt=${token}`]);

            expect(logoutResponse.status).toBe(200);
            expect(logoutResponse.body.message).toBe("Déconnexion réussie");
        });

        it("should handle concurrent logins for different users", async () => {
            const [johnLogin, janeLogin, lolyLogin] = await Promise.all([
                request(app).post("/api/auth/login").send({ email: UnitUser.john.email, password: "Password!123" }),
                request(app).post("/api/auth/login").send({ email: UnitUser.jane.email, password: "Password!123" }),
                request(app).post("/api/auth/login").send({ email: UnitUser.loly.email, password: "Password!123" })
            ]);

            expect(johnLogin.status).toBe(200);
            expect(janeLogin.status).toBe(200);
            expect(lolyLogin.status).toBe(200);

            const johnMe = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${johnLogin.body.data.token}`);

            const janeMe = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${janeLogin.body.data.token}`);

            const lolyMe = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${lolyLogin.body.data.token}`);

            expect(johnMe.body.data.id).toBe(UnitUser.john.id);
            expect(janeMe.body.data.id).toBe(UnitUser.jane.id);
            expect(lolyMe.body.data.id).toBe(UnitUser.loly.id);

            expect(lolyMe.body.data.role).toBe("ADMIN");

            expect(johnMe.body.data).not.toHaveProperty("email");
            expect(janeMe.body.data).not.toHaveProperty("email");
            expect(lolyMe.body.data).not.toHaveProperty("email");
        });
    });
});