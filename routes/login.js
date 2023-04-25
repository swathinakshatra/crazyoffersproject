const config=require('config');
const jwt=require('jsonwebtoken');
const Joi=require('joi');
const {UserReg} = require('../models/userregistration');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const crypto=require('../startup/crypto');
router.post('/login', async (req, res) => {
    // console.log('req.body--->',req.body);
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  // console.log("req",req.body.enc);
  // console.log("req",decryptedDocument);
  const { error } = validatelogins(); 
 if (error) return res.status(400).send(error.details[0].message);
if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      let user = await UserReg.findOne({ phone: decryptedDocument.phone});
      if (!user) {
        return res.status(400).send("user phone number doesnot Registered.");
      } else {
        const validPassword = await bcrypt.compare(
        decryptedDocument.password,
        user.password
        );
        if (!validPassword) {
          return res
            .status(400)
            .send("Invalid Password ,please enter valid password !");
        } else {
          const token=jwt.sign({_id:user._id,email:user.email,phone:user.phone,name:user.name},config.get('jwtPrivateKey'));
          return res.status(200).send(crypto.encryptobj(token));
        }
      }
    }
  });
 

  function validatelogins(req) {
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
  
    return schema.validate(req);
  }
  
  
module.exports=router;