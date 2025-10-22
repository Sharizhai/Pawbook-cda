import {PhotoController} from "$presentation/controllers/photoController";
import {uploadSingle} from "$presentation/middlewares/photoMiddleware";
import express from "express";

export default function photoRoutesFactory(photoController: PhotoController, middleware: { isAuthenticated: any }) {
    const router = express.Router();

    /**
    * @route GET /api/photo/:id/profile-picture
    * @desc Upload une photo de profil
    * @access Protected
    */
    router.post("/:id/profile-picture", middleware.isAuthenticated, uploadSingle, photoController.uploadProfilePicture.bind(photoController));

    return router;
}