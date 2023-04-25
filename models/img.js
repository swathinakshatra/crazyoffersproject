const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  imageData: { type: String, required: true },
});

const img = mongoose.model("img", imageSchema);
exports.img = img; 