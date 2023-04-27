const express = require("express");
const router = express.Router();
const {validatecat} = require("../models/image");
const crypto=require('../startup/crypto');
const redisquery = require("../startup/redis");
const Queries = require("../startup/mongofunctions");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
router.post("/imagecategories",auth,admin,async (req, res) => {
  const { error } = validatecat(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = {
  categories: req.body.categories,
  images:req.body.images};
  const result = await Queries.insertDocument("Image", category);
  if (!result) return res.status(500).send("error saving categories.");
  const categories = await Queries.find("Image");
  if (!categories) return res.status(400).send("categories not found");
  const redisresult=await redisquery.redisSET("imagecategory");
  console.log("redisresult",redisresult);
  return res.status(200).send("categories saved successfully");
});
router.post("/getimages",auth,admin,async (req, res) => {
  const dataExists = await redisquery.redisexists("imagecategory");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("latest"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});
router.post("/getimagecategories",auth,admin,async (req, res) => {
  const categories = await Queries.find("Image");
  if (!categories) return res.status(400).send("categories not found");
  return res.status(200).send(crypto.encryptobj({ success: categories }));
});
 module.exports = router;