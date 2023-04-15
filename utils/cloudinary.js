import url from "url"
import { v2 as cloudinary } from "cloudinary"

export const extractCloudinaryPublicId = (imageURL) => imageURL.split("/").pop().split(".")[0]

export const isCloudinaryURL = (imageURL) => imageURL && url.parse(imageURL).host === "res.cloudinary.com"

export const uploadImage = async (path) => await cloudinary.uploader.upload(path)

export const deleteImage = async (url) => await cloudinary.uploader.destroy(extractCloudinaryPublicId(url))
