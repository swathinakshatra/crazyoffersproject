const express = require("express");
const router = express.Router();
const { Addpost, validatepost } = require("../models/addpost");  
const crypto = require("../startup/crypto");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Queries = require("../startup/mongofunctions");
const redisquery = require("../startup/redis");
router.post("/addpost", async (req, res) => {
 
  const { error } = validatepost(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const newpost = {
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    price: req.body.price,
    images: req.body.images,
  };
  const data = await Queries.insertDocument("post", newpost);
  if (!data) return res.status(400).send("error saving posts.");
  const latest = await Queries.findLatestPosts("post", { createdAt: -1 }, 20);
  const latestposts = await redisquery.redisSET("latest",JSON.stringify(latest));
  console.log("latestposts",latestposts);
  const allpost = await Queries.find("post");
  const allposts = await redisquery.redisSET("allposts",JSON.stringify(allpost));
  console.log("allposts",allposts);
  return res.status(200).send(crypto.encrypt("posts added successfully" ));
});
router.post("/latests", async (req, res) => {
  const dataExists = await redisquery.redisexists("latest");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("latest"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});
router.post("/allposts", async (req, res) => {
  const dataExists = await redisquery.redisexists("allposts");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("allposts"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});
router.post("/categories", async (req, res) => {
  const categories = await Queries.find("post");
  if (!categories) return res.status(400).send("categories not found");
  return res.status(200).send(crypto.encryptobj({ success: categories }));
});
router.post("/latest", async (req, res) => {
  const posts = await Queries.findLatestPosts("post", { createdAt: -1 }, 20);
  if (!posts) return res.status(400).send("Posts not found");
  return res.status(200).send(crypto.encryptobj({ success: posts }));
});
router.post("/allposts", async (req, res) => {
  const posts = await Queries.find("post");
   if (!posts) return res.status(400).send("Posts not found");
  const reversepost=posts.reverse();
  return res.status(200).send(crypto.encryptobj({ success:reversepost }));
});


router.post("/search", async (req, res) => {
  const search = req.body.search;
  if (!search || search.trim() === "") {
    return res.status(400).send("Invalid or missing search term");
  }
  const posts = await Queries.find("post",{$or: [ { title: { $regex: search, $options: "i" } },{ categories: { $regex: search, $options: "i" } },{ description: { $regex: search, $options: "i" } },],
  });
  if (posts.length === 0) {
    return res.status(404).send("No posts found");
  }
  return res.status(200).send(posts);
});
router.post("/lazyloading", async (req, res) => {
  // const decryptedDocument = crypto.decryptobj(req.body.enc);

try {
    const posts = await Queries.lazyloading('post',req.body.skip,10);
    return res.status(200).send(({ success: posts }));
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
});
router.post("/deletepost", async (req, res) => {
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
