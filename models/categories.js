const mongoose = require("mongoose");
const Joi = require('joi');
const catSchema = new mongoose.Schema({
  categories: 
    {
      type: String,
      required: true,
    },
  
  
 
});
const Categories = mongoose.model("Categories", catSchema);
function validatecat(categories) {
  const schema = Joi.object({
    categories: Joi.string().required().messages({
      'array.empty': 'At least one category is required',
      'any.required': 'At least one category is required'
    }),
   

  });

  return schema.validate(categories);
}

exports.Categories = Categories;
exports.validatecat = validatecat;