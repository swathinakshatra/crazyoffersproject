require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const {registrationValidation,loginValidation,} = require("../startup/validations");
const bcrypt = require("bcrypt");
const Queries = require("../startup/mongofunctions");
const redisquery = require("../startup/redis");
const crypto = require("../startup/crypto");
const { generateUserId } = require("../middleware/userid");
router.post('/registration', async (req, res) => {
const { error } = registrationValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const emailExists = await Queries.findOneDocument({ email: req.body.email }, 'User');
  if (emailExists) return res.status(400).send({ error: 'Email already registered' });
  const phoneExists = await Queries.findOneDocument({ phone: req.body.phone }, 'User');
  if (phoneExists) return res.status(400).send({ error: 'Phone number already registered' });
  const newuser = {
    userid: generateUserId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
   
  };
  const user = await Queries.insertDocument("User", newuser);
  if (!user) return res.status(400).send("user does not registered");
  const users = await Queries.find("User");
  const redisResult = await redisquery.redisSET("users", JSON.stringify(users));
  console.log("redisresult", redisResult);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.status(200).send("Registered successfully");
});

router.post("/login", async (req, res) => {
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  const { error } = loginValidation(decryptedDocument);
  if (error) return res.status(400).send(error.details[0].message);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    let user = await Queries.findOneDocument({ phone: decryptedDocument}, "User");
    if (!user) {
      return res.status(400).send("user phone number doesnot Registered.");
    } else {
      const validPassword = await bcrypt.compare(
        decryptedDocument,
        user.password
      );
      if (!validPassword) {
        return res.status(400).send("Invalid Password ,please enter valid password");
      } else {
        const token = jwt.sign(
          {
            userid: user.userid,
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
          process.env.jwtPrivateKey,
          { expiresIn: "2h" }
        );
        return res.status(200).send(crypto.encryptobj(token));
      }
    }
  }
});
module.exports = router;
