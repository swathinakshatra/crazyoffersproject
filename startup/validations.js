const Joi = require("joi");
const registrationValidation = (data) => {
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
  
    return schema.validate(data);
  };
  const loginValidation = (data) => {
    const schema = Joi.object({
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
  
    return schema.validate(data);
  };

const Categoriesvalidation = (data) => {
  const schema = Joi.object({
    categories: Joi.array().items(Joi.string()).min(1).required().messages({
      "array.empty": "At least one category is required",
      "any.required": "At least one category is required",
    }),
  });

  return schema.validate(data);
};
const validate =(data)=>{
  const schema=Joi.object({
     enc:Joi.string().required()
    
  })
  return schema.validate(data);
}
const validatepost=(post)=>{
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
 const validatecategories=(categories)=>{
  const schema = Joi.object({ 
    categories: Joi.string().required().messages({
      'array.empty': 'At least one category is required',
      'any.required': 'At least one category is required'
    }),
   });

  return schema.validate(categories);
}
 
module.exports = {
  registrationValidation,
  loginValidation,
  Categoriesvalidation,
  validate,
  validatepost,
  validatecategories
};