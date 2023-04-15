import cors from "cors"
import morgan from "morgan"
import fileupload from "express-fileupload"
import cookieSession from "cookie-session"

export const corsSettings = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}

export const corsMiddleware = cors(corsSettings)

export const morganMiddleware = () => {
  if (process.env.NODE_ENV === "production") return morgan("short")
  return morgan("dev")
}

export const fileuploadMiddleware = fileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
})

export const sessionMiddleware = cookieSession({
  name: "session",
  secret: process.env.SESSION_SECRET,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  httpOnly: true,
})

export const socketMiddlewareWrapper = (middleware) => (socket, next) => middleware(socket.request, {}, next)
