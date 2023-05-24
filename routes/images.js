const express = require("express");
const router = express.Router();
const {validatecat} = require("../models/image");
const crypto=require('../startup/crypto');
const redisquery = require("../startup/redis");
const Queries = require("../startup/mongofunctions");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const telegram=require("../middleware/async1");
router.post("/image",auth,admin,telegram(async (req, res) => {
  const { error } = validatecat(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = {
  categories: req.body.categories,
  images:req.body.images};
  const result = await Queries.insertDocument("Image", category);
  if (!result) return res.status(500).send("error saving categories.");
  const imagecategory = await Queries.find("Image");
  if (!imagecategory) return res.status(400).send("imagecategory not found");
  const redisresult=await redisquery.redisSET("imagecategory",JSON.stringify(imagecategory));
  console.log("redisresult",redisresult);
  return res.status(200).send("categories saved successfully");
}));
router.post("/getimages",telegram(async (req, res) => {
  const categories = await Queries.find("Image");
  if (!categories) return res.status(400).send("categories not found");
  return res.status(200).send(crypto.encryptobj({ success: categories }));
}));

 

 module.exports = router;