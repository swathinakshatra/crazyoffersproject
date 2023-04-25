const mongoose = require("mongoose");
const Joi = require('joi');
const adddpostSchema = new mongoose.Schema({
 title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 100,
    maxlength: 500
  },
  categories: 
    {
      type: String,
      required: true,
    },
  
  price:{
    type: Number,
    required: true,
    min: 0,
    max: 10000000
  },
  
  
 images: 
    {
      type: String,
      required: true,
    },
  

}, { timestamps: true });
  

const Addpost = mongoose.model("Addpost", adddpostSchema);
function validatepost(post) {
  const schema = Joi.object({
    title: Joi.string().min(10).max(100).required().messages({
      'string.empty': 'Title is required',
      'any.required': 'Title is required'
    }),
    description:Joi.string().min(100).max(500).required().messages({
      'string.empty': 'Description is required',
      'any.required': 'Description is required'
    }),
    categories:Joi.string().min(1).required().messages({
      'array.empty': 'At least one category is required',
      'any.required': 'At least one category is required'
    }),
    price: Joi.number().min(10).max(10000000).required().messages({
      'number.min': 'Price must be greater than or equal to 0',
      'any.required': 'Price is required'
    }),
    images: Joi.string().required().messages({
      'array.empty': 'At least one image is required',
      'any.required': 'At least one image is required'
    })
  });

  return schema.validate(post);
}
exports.Addpost = Addpost; 
exports.validatepost = validatepost;
// function validateSkip(skips) {
//   const schema = Joi.object({
//     skip:Joi.number().min(0).required().messages({
//     'number.min': 'Skip must be greater than or equal to 0',
//     'any.required': 'Skip is required'
//   })
// });

// return schema.validate(skips);
// }
// exports.validateSkip = validateSkip;
  

