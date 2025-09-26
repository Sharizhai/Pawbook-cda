import { IEnv } from "$types/env";
import dotenv from "dotenv";

dotenv.config();

export const env: IEnv = {
    PORT: parseInt(process.env.PORT || "3001"),
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
    MONGO_URI: process.env.MONGO_URI || (() => {
        throw new Error('MONGO_URI must be defined');
    })(),
};