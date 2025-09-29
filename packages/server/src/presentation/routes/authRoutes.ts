import { AuthController } from "../controllers/authController";
import express from "express";

/**
 * Creates routes related to authentication
 *
 * @param authController - Authentication controller
 * @param middleware
 */
export default function authRoutesFactory(authController: AuthController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route POST /api/auth/login
     * @desc Authenticates a user and returns a JWT token
     * @access Public
     */
    router.post("/login", (req, res) => authController.login(req, res));

    /**
     * @route POST /api/auth/login
     * @desc Authenticates a user and returns a JWT token
     * @access Public
     */
    router.post("/logout", (req, res) => authController.logout(req, res));

    /**
     * @route GET /api/auth/me
     * @desc Returns the logged-in member's information
     * @access Protected
     */
    router.get("/me", middleware.isAuthenticated, (req, res) =>
        authController.me(req, res),
    );

    return router;
}