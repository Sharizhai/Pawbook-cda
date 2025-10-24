import {checkPrismaConnection} from "$config/prisma";
import { connect } from "mongoose";
import { env } from "./env";

const { MONGO_URI } = env;

export const connectDB = async () => {
    try {
        if (env.MONGO_URI) {
            const db = await connect(MONGO_URI, { family: 4 });
            console.log(`✅ MongoDB connected: ${db.connection.host}`);
        } else {
            console.warn("⚠️  MONGO_URI not defined — Mongo repositories will fail if used.");
        }

        if (env.USE_POSTGRES === "true") {
            const ok = await checkPrismaConnection();
            if (ok) {
                console.log("✅ Prisma connected to PostgreSQL");
            } else {
                throw new Error("❌ Failed to connect to PostgreSQL");
            }
        }
    } catch (error: any) {
        console.error(`❌ Database connection error: ${error.message}`);
        process.exit(1);
    }
};