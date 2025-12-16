import express from "express"
import {AuthServices} from "$application/services/authServices";
import {AuthController} from "$presentation/controllers/authController";
import {makeAuthMiddleware} from "$presentation/middlewares/authMiddleware";
import authRoutesFactory from "$presentation/routes/authRoutes";
import container from "$config/dependencyInjection";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import postRoutesFactory from "$presentation/routes/postRoutes";
import {PostController} from "$presentation/controllers/postController";
import {UserController} from "$presentation/controllers/userController";
import userRoutesFactory from "$presentation/routes/userRoutes";
import {PhotoController} from "$presentation/controllers/photoController";
import photoRoutesFactory from "$presentation/routes/photoRoutes";
import {AnimalController} from "$presentation/controllers/animalController";
import animalRoutesFactory from "$presentation/routes/animalRoutes";

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
        health: string;
        auth: string;
        users: string;
        posts: string;
        animals: string;
        photos: string;
    };
    documentation?: string;
}

/**
 * Configuration centralisée des routes avec TypeScript
 */
export const setupRoutes = (app: express.Application): void => {
    const userRepository = container.resolve<IUserRepository>("userRepository");
    const authServices = container.resolve<AuthServices>("authServices");

    // Configuration du middleware d"authentification
    const { isAuthenticated } = makeAuthMiddleware(authServices, userRepository);

    // Contrôleurs
    const authController = new AuthController(authServices);
    const postController = container.resolve<PostController>("postController");
    const userController = container.resolve<UserController>("userController");
    const animalController = container.resolve<AnimalController>("animalController");
    const photoController = container.resolve<PhotoController>("photoController");

    // Routes principales
    app.use("/api/auth", authRoutesFactory(authController, { isAuthenticated }));
    app.use("/api/posts", postRoutesFactory(postController, {isAuthenticated}));
    app.use("/api/users", userRoutesFactory(userController));
    app.use("/api/animals", animalRoutesFactory(animalController, {isAuthenticated}));
    app.use("/api/photos", photoRoutesFactory(photoController, {isAuthenticated}));

    // Route de base pour vérifier que l"API fonctionne
    app.get("/api", (req: express.Request, res: express.Response) => {
        const apiInfo: ApiInfo = {
            message: "API Pawbook",
            version: "1.0.0",
            endpoints: {
                health: "/api/health",
                auth: "/api/auth",
                users: "/api/users",
                posts: "/api/posts",
                animals: "/api/animals",
                photos: "/api/photos",
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
                            getPostById: "GET /posts/:id",
                            createPost: "POST /posts/create",
                        },
                        users: {
                            createUser: "POST /users/register",
                        },
                        animals: {
                            createAnimalProfile: "POST /animals/register",
                            getAllAnimalsByOwnerId: "GET /animals/:id",
                        },
                        photos: {
                            uploadProfilePicture: "POST /photos/:id/profile-picture",
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
