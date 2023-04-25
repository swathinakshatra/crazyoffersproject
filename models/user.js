const config=require('config');
const jwt=require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
  userid: { type: String, required: true },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 250,
      unique:true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    phone:{
      type:String,
      required: true,
      maxlength: 10,
      unique:true
    },
    isAdmin: { type: Boolean, default: false }
 
    
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
name: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).max(30).required(),
email: Joi.string().email().min(5).max(250).required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
      'string.min': 'Email should have a minimum length of {#limit}',
      'string.max': 'Email should have a maximum length of {#limit}',
      'any.required': 'Email is required'
    }),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
      'string.pattern.base': 'Password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
    phone: Joi.string().pattern(/^[6789]\d{9}$/).required().messages({
      'string.pattern.base': 'Phone number should start with 6, 7, 8 or 9 and have 10 digits',
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required'
    })
   
  });

  return schema.validate(user);
}

exports.User = User; 
exports.validateUser = validateUser;