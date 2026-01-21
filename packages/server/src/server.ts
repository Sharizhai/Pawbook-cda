import {Request, Response, NextFunction} from "express";
import {setupRoutes} from "$presentation/routes";
import {connectDB} from "$config/database";
import cookieParser from "cookie-parser";
import { env } from "$config/env";
import express from "express";
import helmet from 'helmet';
import cors from "cors";

const {PORT, NODE_ENV} = env;

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true
  } : false
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

app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;