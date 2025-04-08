import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    expirationDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

export default Link;
