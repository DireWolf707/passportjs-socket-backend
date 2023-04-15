// Global Exception Handler
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...")
  console.error(err.name, err.message)
  if (process.env.NODE_ENV === "production") process.exit(1)
})

import "./configs/dotenv/config.js"
import "./configs/mongo/config.js"
import "./models/index.js"
import "./configs/passport/config.js"
import "./configs/cloudinary/config.js"
import app from "./app.js"
import passport from "passport"
import { sessionMiddleware, socketMiddlewareWrapper } from "./middlewares/global.js"
import { isAuthenticated } from "./middlewares/auth.js"
import { corsSettings } from "./middlewares/global.js"
import { createServer } from "http"
import { Server } from "socket.io"

// Server Init
const httpServer = createServer(app)

// SocketIO Init
const io = new Server(httpServer, {
  serveClient: false,
  cors: corsSettings,
})
io.use(socketMiddlewareWrapper(sessionMiddleware))
io.use(socketMiddlewareWrapper(passport.initialize()))
io.use(socketMiddlewareWrapper(passport.session()))
io.use(socketMiddlewareWrapper(isAuthenticated))

io.on("connection", (socket) => {
  console.log(`new connection ${socket.id}`)

  socket.on("whoami", () => {
    console.log(socket.request.user.email)
  })
})

// Server Start
const port = process.env.PORT || 3000
const server = httpServer.listen(port, () => console.log(`App running on port ${port}...`))

// Global Promise Rejection Handler
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...")
  console.error(err.name, err.message)
  server.close(() => process.env.NODE_ENV === "production" && process.exit(1))
})

// SIGTERM Handler
process.on("SIGTERM", () => {
  console.error("SIGTERM RECEIVED! Shutting down gracefully")
  server.close(() => console.log("Process terminated!"))
})
