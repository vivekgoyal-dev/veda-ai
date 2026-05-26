import mongoose from "mongoose";
import { env } from "./env";

export async function connectMongo(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });
  console.log("[mongo] connected");
}
