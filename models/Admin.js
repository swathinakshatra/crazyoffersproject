const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 10,
    unique: true,
  },
  isAdmin: { type: Boolean, default: false },
});

const Admin = mongoose.model("Admin", userSchema);
exports.Admin = Admin;
