import {PhotoController} from "$presentation/controllers/photoController";
import {uploadSingle} from "$presentation/middlewares/photoMiddleware";
import express from "express";

export default function photoRoutesFactory(photoController: PhotoController) {
    const router = express.Router();

    /**
    * @route GET /api/photo/profile-picture
    * @desc Upload une photo de profil
    * @access Protected
    */
    router.post("/profile-picture", uploadSingle, photoController.uploadProfilePicture.bind(photoController));

    return router;
}