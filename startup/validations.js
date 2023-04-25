const Joi = require("joi");
const registrationValidation = (data) => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().min(5).max(250).required(),
      password: Joi.string().pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
      phone: Joi.string().pattern(/^[6789]\d{9}$/).required(),
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
 



// const Imagesvalidation = (images) => {
//   const schema = Joi.object({
//     categories: Joi.array().items(Joi.string()).min(1).required().messages({
//       "array.empty": "At least one category is required",
//       "any.required": "At least one category is required",
//     }),
//     images: Joi.array().items(Joi.string()).min(1).required().messages({
//       "array.empty": "At least one image is required",
//       "any.required": "At least one image is required",
//     }),
//   });

//   return schema.validate(images);
// };


module.exports = {
  registrationValidation,
  Categoriesvalidation,
  //Imagesvalidation,
  validate
};
