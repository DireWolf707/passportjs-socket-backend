import express from "express"
import helmet from "helmet"
import passport from "passport"
import { corsMiddleware, morganMiddleware, fileuploadMiddleware, sessionMiddleware } from "./middlewares/global.js"

import AppError from "./utils/appError.js"
import globalErrorHandler from "./controllers/errorController.js"
import userRouter from "./routes/userRoute.js"

// Express app Init
const app = express()

// Enable when runing behind a reverse proxy
app.enable("trust proxy")

// GLOBAL MIDDLEWARES
app.use(corsMiddleware)

// Enable when serving static files
// app.use(express.static(path.join(__dirname, "public")))

app.use(helmet()) // Set security HTTP headers

// Logging
app.use(morganMiddleware())

// Body parser
app.use(express.json({ limit: "10kb" })) // for json data
// app.use(express.urlencoded({ extended: true, limit: "10kb" })) // for html form data

// File upload
app.use(fileuploadMiddleware)

// Cookie Session
app.use(sessionMiddleware)

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Custom middlewares
// app.use((req, res, next) => {next()})

// ROUTES
app.get("/", (req, res, next) => res.json("DireWolf!"))
app.use("/user", userRouter)

// 404 Handler
app.all("*", (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)))

// Error Handler
app.use(globalErrorHandler)

export default app
