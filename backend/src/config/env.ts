import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

const envSchema = z.object({
  PORT: z.string().default("4000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().default("./serviceAccountKey.json"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"),
  RATE_LIMIT_MAX: z.string().default("100"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = {
  port: Number(parsed.data.PORT),
  nodeEnv: parsed.data.NODE_ENV,
  firebaseServiceAccountPath: parsed.data.FIREBASE_SERVICE_ACCOUNT_PATH,
  corsOrigin: parsed.data.CORS_ORIGIN,
  rateLimitWindowMs: Number(parsed.data.RATE_LIMIT_WINDOW_MS),
  rateLimitMax: Number(parsed.data.RATE_LIMIT_MAX),
} as const
