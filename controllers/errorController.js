import AppError from "./../utils/appError.js"

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const errors = Object.keys(err.keyValue).map((path) => `${path}:${path} is already in use`)
  const message = errors.join(",")
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(({ path, message }) => `${path}:${message}`)
  const message = errors.join(",")
  return new AppError(message, 400)
}

const sendError = (err, req, res) => {
  // Operational error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }

  // Unknown error: don't send error details
  console.error(err)
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  })
}

export default (err, req, res, next) => {
  // Mongo Errors
  if (err.name === "ValidationError") err = handleValidationErrorDB(err)
  if (err.code === 11000) err = handleDuplicateFieldsDB(err)
  if (err.name === "CastError") err = handleCastErrorDB(err)

  sendError(err, req, res)
}
