import express from "express"
import cors from "cors"
import helmet from "helmet"
import { env } from "./config/env.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import routes from "./routes/index.js"

const app = express()

// Middlewares
app.use(helmet())
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(express.json())

// Routes
app.use("/api", routes)

// Error handler
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port} [${env.nodeEnv}]`)
})

export default app
