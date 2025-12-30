import {PostReportController} from "$presentation/controllers/postReportController";
import express from "express";

/**
 * Routes pour la gestion des posts de Pawbook
 * @param postReportController - Contrôleur des posts
 * @param middleware - Middleware
 */

export default function postReportRoutesFactory(postReportController: PostReportController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route POST /api/post-reports/register
     * @desc Enregistre un nouveau signalement de post
     * @access Protected
     */
    router.post("/register", middleware.isAuthenticated, postReportController.createPostReport.bind(postReportController));

    return router;
}