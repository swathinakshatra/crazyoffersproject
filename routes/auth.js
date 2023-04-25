const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("../startup/crypto");
router.post('/admin', async (req, res) => {
  console.log("req",req.body.enc);
  console.log("hit");
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  console.log("decryptedDocument",decryptedDocument);  
  const { error } = validatelogin(decryptedDocument);
    if (error) return res.status(400).send(error.details[0].message);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      let user = await User.findOne({ email: decryptedDocument.email});
      if (!user) {
        return res.status(400).send("Admin doesnot Registered.");
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
          const token=jwt.sign({_id:user._id,email:user.email,isAdmin:user.isAdmin},config.get('jwtPrivateKey'),{
            expiresIn: "2h",
        },);
          return res.status(200).send(crypto.encryptobj(token));
        }
      }
    }
  });

function validatelogin(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(250).required(),
    password: Joi.string().required(),
  });
  return schema.validate(req);
}
module.exports = router;
