import express from "express"
import cors from "cors"
import helmet from "helmet"
import { env } from "./config/env.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import routes from "./routes/index.js"

const app = express()
const configuredOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const isLocalDevOrigin = (origin: string) => /^https?:\/\/localhost:\d+$/.test(origin)

// Middlewares
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (configuredOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked origin: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: "5mb" }))

// Routes
app.use("/api", routes)

// Error handler
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} [${env.nodeEnv}]`)
})

export default app
