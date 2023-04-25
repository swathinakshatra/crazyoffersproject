const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  userImage: {
    data: Buffer,
    contentType: String
  }
});

const userimages = mongoose.model("userimages", imageSchema);
exports.userimages = userimages; 