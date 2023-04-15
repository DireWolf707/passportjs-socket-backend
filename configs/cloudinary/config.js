import { v2 as cloudinary } from "cloudinary"
cloudinary.config({ secure: process.env.NODE === "production" })
