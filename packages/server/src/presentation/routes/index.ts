import express from "express"
import {AuthServices} from "$application/services/authServices";
import {AuthController} from "$presentation/controllers/authController";
import {makeAuthMiddleware} from "$presentation/middlewares/authMiddleware";
import authRoutesFactory from "$presentation/routes/authRoutes";
import container from "$config/dependencyInjection";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import postRoutesFactory from "$presentation/routes/postRoutes";
import {PostController} from "$presentation/controllers/postController";

/**
 * Interface pour les statistiques de santé de l"API
 */
interface HealthStats {
    status: "healthy" | "unhealthy";
    timestamp: string;
    service: string;
    version: string;
    uptime: number;
    environment: string;
}

/**
 * Interface pour les informations de base de l"API
 */
interface ApiInfo {
    message: string;
    version: string;
    endpoints: {
        auth: string;
        users: string;
        health: string;
    };
    documentation?: string;
}

/**
 * Configuration centralisée des routes avec TypeScript
 */
export const setupRoutes = (app: express.Application): void => {
    const userRepository = container.resolve<IUserRepository>("userRepository");
    const postRepository = container.resolve("postRepository");
    const authServices = container.resolve<AuthServices>("authServices");

    // Configuration du middleware d"authentification
    const { isAuthenticated } = makeAuthMiddleware(authServices, userRepository);

    // Contrôleurs
    const authController = new AuthController(authServices);
    const postController = container.resolve<PostController>("postController");

    // Routes principales
    app.use("/api/auth", authRoutesFactory(authController, { isAuthenticated }));
    app.use("/api/posts", postRoutesFactory(postController, {isAuthenticated}));

    // Route de base pour vérifier que l"API fonctionne
    app.get("/api", (req: express.Request, res: express.Response) => {
        const apiInfo: ApiInfo = {
            message: "API Pawbook",
            version: "1.0.0",
            endpoints: {
                auth: "/api/auth",
                users: "/api/users",
                health: "/api/health",
            },
            documentation:
                process.env.NODE_ENV === "development"
                    ? "/api/docs"
                    : undefined,
        };

        res.json({
            success: true,
            data: apiInfo,
        });
    });

    // Route de santé pour le monitoring
    app.get("/api/health", (req: express.Request, res: express.Response) => {
        const healthStats: HealthStats = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            service: "Pawbook API",
            version: "1.0.0",
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
        };

        res.json({
            success: true,
            data: healthStats,
        });
    });

    // Route pour les métriques (optionnel)
    app.get("/api/metrics", (req: express.Request, res: express.Response) => {
        const metrics = {
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            platform: process.platform,
            nodeVersion: process.version,
            pid: process.pid,
        };

        res.json({
            success: true,
            data: metrics,
        });
    });

    // Documentation API (en développement uniquement)
    if (process.env.NODE_ENV === "development") {
        app.get("/api/docs", (req: express.Request, res: express.Response) => {
            res.json({
                success: true,
                data: {
                    title: "Pawbook API Documentation",
                    version: "1.0.0",
                    description:
                        "API REST pour la gestion d'une communauté",
                    baseUrl: `${req.protocol}://${req.get("host")}/api`,
                    endpoints: {
                        authentication: {
                            login: "POST /auth/login",
                            logout: "POST /auth/logout",
                            me: "GET /auth/me",
                        },
                        posts: {
                            getAllPosts: "GET /posts",
                        },
                        utility: {
                            health: "GET /health",
                            metrics: "GET /metrics",
                            docs: "GET /docs",
                        },
                    },
                },
            });
        });
    }
};
