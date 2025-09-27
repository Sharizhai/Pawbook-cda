import {setupRoutes} from "$presentation/routes";
import {connectDB} from "$config/database";
import { env } from "$config/env";
import express from "express";
import cors from "cors";

const {PORT, NODE_ENV} = env;

const app = express();

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

setupRoutes(app);

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;