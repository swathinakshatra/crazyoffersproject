const express = require("express");
const router = express.Router();
const {validatecat} = require("../models/categories");
const crypto=require('../startup/crypto');
const Queries = require("../startup/mongofunctions");
const redisquery = require("../startup/redis");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
router.post("/categories",auth,admin,async (req, res) => {
  const { error } = validatecat(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = {
  categories: req.body.categories};
  const result = await Queries.insertDocument("Categories", category);
  if (!result) return res.status(500).send("error saving categories.");
  const allcategories=await Queries.find("Categories");
  const categories=await redisquery.redisSET("categories",JSON.stringify(allcategories));
  console.log("categories",categories);
  return res.status(200).send("categories saved successfully");
});
router.post("/allcategories", auth,admin,async (req, res) => {
  const dataExists = await redisquery.redisexists("categories");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No categories");
  }
  const dataGet = await redisquery.redisget("categories"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});

module.exports = router;