const mongoose = require("mongoose");
const Joi = require('joi');
const catSchema = new mongoose.Schema({
  categories: [
    {
      type: String,
      required: true,
      unique:true,
     
    },
  ],
});
const Categories = mongoose.model("Categories", catSchema);
function validatecat(categories) {
  const schema = Joi.object({
    categories: Joi.array().items(Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9 ]+$/)).unique().required().messages({
      'array.empty': 'At least one category is required',
      'any.required': 'At least one category is required',
      'array.unique': 'Duplicate categories are not allowed',
      'string.min': 'Category must be at least 3 characters long',
      'string.max': 'Category must not exceed 50 characters',
      'string.pattern.base': 'Category must contain only letters, numbers, and spaces'
    })
  

   

  });

  return schema.validate(categories);
}

exports.Categories = Categories;
exports.validatecat = validatecat;