require("dotenv").config();
const jwt = require("jsonwebtoken");
const {registrationValidation,loginValidation}=require('../startup/validations');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("../startup/crypto");
const Queries = require("../startup/mongofunctions");
const telegram=require("../middleware/async1");
router.post("/registrations", telegram(async (req, res) => {
  const decrypted = crypto.decryptobj(req.body.enc);
  const { error } = registrationValidation(decrypted);
  if (error) return res.status(400).send(error.details[0].message);
  const emailExists = await Queries.findOneDocument({ email: decrypted.email },'Admin');
  if (emailExists) return res.status(400).send("Email already registered.");
  const phoneExists = await Queries.findOneDocument({ phone: decrypted.phone },'Admin');
  if (phoneExists) return res.status(400).send("Phone number already registered.");
  const newuser = {
    name: decrypted.name,
    email: decrypted.email,
    password: decrypted.password,
    phone: decrypted.phone,
  };
  const user = await Queries.insertDocument("Admin", newuser);
  if(!user) return res.status(400).send("user does not registered");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.status(200).send("Registered successfully");
}));
router.post("/login", telegram(async (req, res) => {
  const decrypted = crypto.decryptobj(req.body.enc);
  const { error } = loginValidation(decrypted);
  if (error) return res.status(400).send(error.details[0].message);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    const user = await Queries.findOneDocument({ phone: decrypted.phone},'Admin');
    if (!user) {
      return res.status(400).send("Admin doesnot Registered.");
    } else {
      const validPassword = await bcrypt.compare(decrypted.password,user.password);
      if (!validPassword) {
     return res.status(400).send("Invalid Password ,please enter valid password !");
      } else {
        const token = jwt.sign(
          { _id: user._id,name:user.name,email:user.email, phone:user.phone,isAdmin:user.isAdmin},process.env.jwtPrivateKey,
          { expiresIn: "2h" }
        );
        return res.status(200).send(crypto.decryptobj(token));
      }
    }
  }
}));

module.exports = router;