const mongoose = require("mongoose");
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    categories: {
      type: String,
      required: true
    },
    images: 
      {
        type: String,
        required: true,
      },
    
  });
  
  const Image = mongoose.model('Image', categorySchema);
  function validatecat(categories) {
    const schema = Joi.object({
      categories: Joi.string().min(1).required().messages({
        'array.empty': 'At least one category is required',
        'any.required': 'At least one category is required'
      }),
      images: Joi.string().required(),
       
      })
    
      
    return schema.validate(categories);
  }
  exports.Image = Image;
  exports.validatecat = validatecat;

 
 
  
  
  
  
  