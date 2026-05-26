import "dotenv/config";

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  mongoUri: required("MONGODB_URI", process.env.MONGODB_URI),
  redisUrl: required("REDIS_URL", process.env.REDIS_URL),
  geminiApiKey: required("GEMINI_API_KEY", process.env.GEMINI_API_KEY),
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.0-flash-exp",
};
