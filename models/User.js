import mongoose from "mongoose"

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "username is required"],
    minLength: [2, "username should be of min length 2"],
  },
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
    minLength: [2, "name should be of min length 2"],
  },
  avatar: {
    type: String,
  },
})

const model = mongoose.model("user", schema)

export default model
