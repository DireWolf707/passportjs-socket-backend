import catchAsync from "../utils/catchAsync.js"
import AppError from "../utils/appError.js"
import { isCloudinaryURL, uploadImage, deleteImage } from "../utils/cloudinary.js"
import { User } from "../models/index.js"

export const getProfile = (req, res) => {
  if (!req.user) return res.json({ status: "success" })

  const { email, avatar, name, username } = req.user
  res.json({
    status: "success",
    data: { email, avatar, name, username },
  })
}

export const updateProfile = catchAsync(async (req, res, next) => {
  ;["email"].forEach((field) => delete req.body[field])
  await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true })
  res.status(200).json({ status: "success", data: "Profile Updated Successfully!" })
})

export const updateAvatar = catchAsync(async (req, res, next) => {
  const image = req?.files?.file
  if (!image || !image.mimetype.startsWith("image/")) throw new AppError("Please upload a Image file", 400)

  const avatar = await uploadImage(image.tempFilePath) // upload on cloudinary
  await User.findByIdAndUpdate(req.user._id, { avatar: avatar.secure_url }) // update user

  const prevAvatarURL = req.user.avatar
  if (isCloudinaryURL(prevAvatarURL)) deleteImage(prevAvatarURL) // delete on cloudinary

  res.status(200).json({ status: "success", data: "Avatar Updated Successfully!" })
})

export const deleteAvatar = catchAsync(async (req, res, next) => {
  const avatarURL = req.user.avatar

  if (isCloudinaryURL(avatarURL)) deleteImage(avatarURL) // delete on cloudinary
  await User.findByIdAndUpdate(req.user._id, { avatar: null })

  res.status(200).json({ status: "success", data: "Avatar Deleted Successfully!" })
})

export const logout = (req, res) => {
  req.logout()
  res.json({ status: "success" })
}
