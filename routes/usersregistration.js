const express = require("express");
const router = express.Router();
const { UserReg, validateRegister } = require("../models/userregistration");
const bcrypt = require("bcrypt");
const crypto = require("../startup/crypto");
router.post("/registration", async (req, res) => {
  console.log("req.body--->", req.body);
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  console.log("req", req.body.enc);
  console.log("req", decryptedDocument);
  const { error } = validateRegister(decryptedDocument);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await UserReg.findOne({
    $or: [
      { email: decryptedDocument.email },
      { phone: decryptedDocument.phone },
    ],
  });
  if (user) {
    if (user.email === decryptedDocument.email) {
      return res.status(400).send("Email already registered.");
    } else if (user.phone === decryptedDocument.phone) {
      return res.status(400).send("Phone number already registered.");
    }
  }
  user = new UserReg({
    name: decryptedDocument.name,
    email: decryptedDocument.email,
    password: decryptedDocument.password,
    phone: decryptedDocument.phone,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.status(200).send("Registered successfully");
});

module.exports = router;
