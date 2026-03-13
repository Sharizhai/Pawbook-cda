export interface IEnv {
    PORT: number;
    HOST: string;
    NODE_ENV: "development" | "production" | "test";

    JWT_SECRET: string;
    JWT_EXPIRATION_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRATION_SECRET: string;

    FRONTEND_URL: string;
    ORIGIN: string;

    // Database selection
    USE_POSTGRES?: string;

    //Databases
    MONGO_URI?: string;
    DATABASE_URL?: string;

    //Supabase cert
    SUPABASE_CA_CERT?: string;

    // Nodemailer
    EMAIL_USER: string;
    EMAIL_APP_PASSWORD: string;
    JWT_RESET_PWD_SECRET: string;

    // Cloudinary
    CLOUDINARY_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    LOGO_URL: string;

    // // Helmet
    // FRONTEND_DOMAIN: string;
    // BACKEND_URL: string;
}