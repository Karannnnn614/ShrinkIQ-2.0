import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  deviceInfo: {
    type: String,
    required: true,
  },
});

const Click = mongoose.model("Click", clickSchema);

export default Click;
