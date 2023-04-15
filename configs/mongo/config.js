import mongoose from "mongoose"

try {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB connection successful!")
} catch (err) {
  console.error("Error in MongoDB Connection!")
  console.error(err.name, err.message)
  process.exit(1)
}
