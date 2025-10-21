import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, '../../../uploads/temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Le fichier doit être une image (JPEG, PNG ou WebP)'));
    }
};

export const uploadSingle = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB
        files: 1
    },
    fileFilter: fileFilter
}).single('photo');

export const uploadMultiple = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 10
    },
    fileFilter: fileFilter
}).array('photos', 10);