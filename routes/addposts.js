const express = require("express");
const router = express.Router();
const { Addpost, validatepost } = require("../models/addpost");  
const crypto = require("../startup/crypto");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Queries = require("../startup/mongofunctions");
const redisquery = require("../startup/redis");

router.post("/addpost",auth,admin,async (req, res) => {
const decrypted = crypto.decryptobj(req.body.enc);
const { error } = validatepost(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const newpost = {
    title: decrypted.title,
    description: decrypted.description,
    categories: decrypted.categories,
    price: decrypted.price,
    images: decrypted.images,
  };
  const data = await Queries.insertDocument("Addpost", newpost);
  if (!data) return res.status(400).send("error saving posts.");
  const posts = await Queries.findLatestPosts("Addpost", { createdAt: -1 }, 20);
  const allposts = await Queries.find("Addpost");
  const redisresult = await redisquery.redisSET("posts",JSON.stringify(posts));
  console.log("redisresult",redisresult);
  const redisResult = await redisquery.redisSET("allposts",JSON.stringify(allposts));
  console.log("redisresult",redisResult);
  return res.status(200).send("posts added successfully");
});
router.post("/latest", async (req, res) => {
  const dataExists = await redisquery.redisexists("posts");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("posts"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});
router.post("/allposts", auth,admin,async (req, res) => {
  const dataExists = await redisquery.redisexists("allposts");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("allposts"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});
router.post("/search", async (req, res) => {
const decrypted = crypto.decryptobj(req.body.enc);
 const search = decrypted.search;
 const query = { $or: [
        { title: { $regex: new RegExp(search.split('').join('.*'), 'i') } },
        { categories: { $regex: new RegExp(search.split('').join('.*'), 'i') } },
        { description: { $regex: new RegExp(search.split('').join('.*'), 'i') } } ]};
 const posts = await Addpost.find(query);
 return res.status(200).json(crypto.encryptobj(posts));
  });
router.post("/lazyloading", async (req, res) => {
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
});
router.post("/deletepost",auth,admin,async (req, res) => {
  const { postId } = req.body;
  try {
    const deletedPost = await Queries.findOneAndDelete({ _id: postId }, "Addpost");
    if (!deletedPost) {
      return res.status(404).send("Post not found");
    }
    return res.status(200).send("post deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});
module.exports = router;
