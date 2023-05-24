const express = require("express");
const router = express.Router();
const { Addpost, validatepost } = require("../models/addpost");  
const crypto = require("../startup/crypto");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const Queries = require("../startup/mongofunctions");
const redisquery = require("../startup/redis");
const telegram=require("../middleware/async1");
router.post("/addpost",auth,isAdmin,telegram(async(req, res) => {
const decrypted = crypto.decryptobj(req.body.enc);
const { error } = validatepost(decrypted);
  if (error) return res.status(400).send(error.details[0].message);
  const newpost = {
    title: decrypted.title,
    description: decrypted.description,
    categories: decrypted.categories,
    price: decrypted.price,
    images: decrypted.images,
  };
 const title=req.body.title
  const data = await Queries.insertDocument("Addpost", newpost);
  if (!data) return res.status(400).send("error saving posts.");
  const posts = await Queries.findLatestPosts("Addpost", { createdAt: -1 }, 20);
  const allposts = await Queries.find("Addpost");
  const redisresult = await redisquery.redisSET("posts",JSON.stringify(posts));
  console.log("redisresult",redisresult);
  const redisResult = await redisquery.redisSET("allposts",JSON.stringify(allposts));
  console.log("redisresult",redisResult);
  const result=await redisquery.redishset("onepost",title,data);
  console.log(result,"result");
  return res.status(200).send("posts added successfully");

}));
router.post("/latest", auth,isAdmin,telegram(async (req, res) => {
  const dataExists = await redisquery.redisexists("posts");
  //console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("posts"); 
  //console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.decryptobj({ dataGet }));
}));
router.post("/allposts",telegram(async (req, res) => {
  const dataExists = await redisquery.redisexists("allposts");
  //console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("allposts"); 
  //console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encryptobj({dataGet}));
}));

router.post("/search", telegram(async (req, res) => {
const decrypted = crypto.decryptobj(req.body.enc);
const search = decrypted.search;
const query = { $or: [
        { title: { $regex: new RegExp(search.split('').join('.*'), 'i') } },
        { categories: { $regex: new RegExp(search.split('').join('.*'), 'i') } },
        { description: { $regex: new RegExp(search.split('').join('.*'), 'i') } } ]};
 const posts = await Addpost.find(query);
 return res.status(200).json(crypto.encryptobj({posts}));
  }));
router.post("/lazyloading", telegram(async(req, res) => {
 const decrypted = crypto.decryptobj(req.body.enc);
 const limit = 10;
  let skip = decrypted.skip;
  if (isNaN(skip) || typeof skip !== "number") {
    return res.status(400).send({ error: "Invalid request. Skip value must be a number." });
  }
 const totalPosts = await Addpost.countDocuments();
  if (skip > totalPosts) {
    return res.status(400).send({ error: "No more posts" });
  }
  const posts = await Addpost.find().skip(skip).limit(limit);
  return res.status(200).send(crypto.encryptobj({ success: posts }));
}));

router.post("/deletepost", auth,isAdmin,telegram(async (req, res) => {
 let title=req.body.title;
  const dataExists = await redisquery.redisexists("onepost",title);
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const deletepost = await redisquery.redishdelete("onepost",title); 
  console.log(deletepost, "deletepost");
  return res.status(200).send("post deleted successfully");
}));
router.post("/alldelete", auth,isAdmin,telegram(async (req, res) => {
  const dataExists = await redisquery.redisexists("allposts");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts"); 
  }
  const alldelete = await redisquery.redisdelete("allposts"); 
  console.log("deleteall",alldelete);
  return res.status(200).send(({alldelete}));
}));
module.exports = router;
