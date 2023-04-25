// const { User, validateUser } = require("../models/user");
// const mongoose = require("mongoose");
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const Queries = require("../startup/mongofunctions");
// router.post("/register", async (req, res) => {
//   const { error } = validateUser(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   const user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send("user already registered.");
//   user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     phone: req.body.phone,
//     isAdmin: req.body.isAdmin,
//   });
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
//   await user.save();

//  return res.status(200).send("Registred successfully");
// });
// module.exports = router;
