import {Request, Response, NextFunction} from "express";
import {setupRoutes} from "$presentation/routes";
import {connectDB} from "$config/database";
import cookieParser from "cookie-parser";
import { env } from "$config/env";
import express from "express";
import helmet from "helmet";
import cors from "cors";

const {PORT, HOST, NODE_ENV} = env;

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                `https://${process.env.FRONTEND_DOMAIN}`
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "https://fonts.gstatic.com",
                "https://fonts.googleapis.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:",
                "blob:",
                "cloudinary.com",
                `https://${process.env.FRONTEND_DOMAIN}`
            ],
            connectSrc: [
                "'self'",
                `https://${process.env.FRONTEND_DOMAIN}`,
                `${process.env.BACKEND_URL}`
            ],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: [],
            blockAllMixedContent: []
        }
    },

    frameguard: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hidePoweredBy: true,
    noSniff: true,
}));

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
}));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

setupRoutes(app);

connectDB();

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;