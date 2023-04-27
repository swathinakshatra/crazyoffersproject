const Joi = require('joi');
const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
  userid: { type: String, required: true },
  name:{
    type: String,
    minlength: 3,
    maxlength: 50
  },
  email:{
      type: String,
      required: true,
      minlength: 5,
      maxlength: 250,
      unique:true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024
    },
    phone:{
      type:String,
      required: true,
      maxlength: 10,
      unique:true
    },
   
});
const User = mongoose.model('User', userSchema);
exports.User = User; 
