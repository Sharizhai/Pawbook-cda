import { IEnv } from "$types/env";
import dotenv from "dotenv";

dotenv.config({ override: false });

export const env: IEnv = {
    PORT: parseInt(process.env.PORT || "3001"),
    HOST: process.env.HOST || "0.0.0.0",
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',

    JWT_SECRET: process.env.JWT_SECRET || (() => {
        throw new Error('JWT_SECRET must be defined');
    })(),
    JWT_EXPIRATION_SECRET: process.env.JWT_EXPIRATION_SECRET || (() => {
        throw new Error('JWT_EXPIRATION_SECRET must be defined');
    })(),
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || (() => {
        throw new Error('REFRESH_TOKEN_SECRET must be defined');
    })(),
    REFRESH_TOKEN_EXPIRATION_SECRET: process.env.REFRESH_TOKEN_EXPIRATION_SECRET || (() => {
        throw new Error('REFRESH_TOKEN_EXPIRATION_SECRET must be defined');
    })(),

    FRONTEND_URL: process.env.FRONTEND_URL || (() => {
        throw new Error('FRONTEND_URL must be defined');
    })(),
    ORIGIN: process.env.ORIGIN || (() => {
        throw new Error('ORIGIN must be defined');
    })(),

    USE_POSTGRES: process.env.USE_POSTGRES,

    //Databases
    MONGO_URI: process.env.MONGO_URI,
    DATABASE_URL: process.env.DATABASE_URL,

    //Supabase CERT
    SUPABASE_CA_CERT: process.env.SUPABASE_CA_CERT,

    // Nodemailer
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    JWT_RESET_PWD_SECRET: process.env.JWT_RESET_PWD_SECRET,

    // Resend
    RESEND_API_KEY: process.env.RESEND_API_KEY|| (() => {
        throw new Error('RESEND_API_KEY must be defined');
    })(),

    // Cloudinary
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || (() => {
        throw new Error('CLOUDINARY_URL must be defined');
    })(),
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || (() => {
        throw new Error('CLOUDINARY_CLOUD_NAME must be defined');
    })(),
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || (() => {
        throw new Error('CLOUDINARY_API_KEY must be defined');
    })(),
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || (() => {
        throw new Error('CLOUDINARY_API_SECRET must be defined');
    })(),
    LOGO_URL: process.env.LOGO_URL || (() => {
        throw new Error('LOGO_URL must be defined');
    })(),
};