import AppError from "../utils/appError.js"

export const isAuthenticated = (req, res, next) => {
  if (!req.user) next(new AppError("Not Authorized", 403))
  else next()
}
