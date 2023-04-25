const express = require("express");
const router = express.Router();
const { Addpost, validatepost } = require("../models/addpost");  
const crypto = require("../startup/crypto");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Queries = require("../startup/mongofunctions");
const redisquery = require("../startup/redis");

router.post("/addpost",auth,admin,async (req, res) => {
  // console.log("req.body--->", req.body);
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  // console.log("req", req.body.enc);
  // console.log("req", decryptedDocument);
  const { error } = validatepost(decryptedDocument);
  if (error) return res.status(400).send(error.details[0].message);
  const newpost = {
    title: decryptedDocument.title,
    description: decryptedDocument.description,
    categories: decryptedDocument.categories,
    price: decryptedDocument.price,
    images: decryptedDocument.images,
  };
  const data = await Queries.insertDocument("Addpost", newpost);
  if (!data) return res.status(400).send("error saving posts.");
  const posts = await Queries.findLatestPosts("Addpost", { createdAt: -1 }, 20);
  console.log(posts, "posts");
  // const redisResult = await redisquery.redisSET("posts",JSON.stringify(posts));
  // console.log("redisresult",redisResult);
  return res.status(200).send(crypto.encrypt("posts added successfully" ));
});
router.post("/latests", async (req, res) => {
  const dataExists = await redisquery.redisexists("posts");
  console.log(dataExists);
  if (!dataExists) {
    return res.status(400).send("No posts");
  }
  const dataGet = await redisquery.redisget("posts"); 
  console.log(dataGet, "dataGet");
  return res.status(200).send(crypto.encrypt({ dataGet }));
});
router.post("/categories", auth,admin,async (req, res) => {
  const categories = await Queries.find("Addpost");
  if (!categories) return res.status(400).send("categories not found");
  return res.status(200).send(crypto.encryptobj({ success: categories }));
});
router.post("/latest", async (req, res) => {
  const posts = await Queries.findLatestPosts("Addpost", { createdAt: -1 }, 20);
  if (!posts) return res.status(400).send("Posts not found");
  return res.status(200).send(crypto.encryptobj({ success: posts }));
});
router.post("/allposts", async (req, res) => {
  const posts = await Queries.find("Addpost");
  
  if (!posts) return res.status(400).send("Posts not found");
  const reversepost=posts.reverse();
  return res.status(200).send(crypto.encryptobj({ success:reversepost }));
});

router.post("/categories", async (req, res) => {
  const categories = await Queries.find("Addpost");
  if (!categories) return res.status(400).send("categories not found");
  const reversedCategories = categories.reverse();
  return res.status(200).send(crypto.encryptobj({ success: reversedCategories }));
});
router.post("/search", async (req, res) => {
  console.log("req.body--->", req.body);
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  console.log("req", req.body.enc);
  console.log("req", decryptedDocument);
  const search = decryptedDocument.search;
  if (!search || search.trim() === "") {
    return res.status(400).send("Invalid or missing search term");
  }
  const posts = await Addpost.find({$or: [ { title: { $regex: search, $options: "i" } },{ categories: { $regex: search, $options: "i" } },{ description: { $regex: search, $options: "i" } },],
  });
  if (posts.length === 0) {
    return res.status(404).send("No posts found");
  }
  return res.status(200).send(crypto.encryptobj({ success: posts }));
});
router.post("/lazyloading", async (req, res) => {
  //console.log("req.body--->", req.body);
  const decryptedDocument = crypto.decryptobj(req.body.enc);
  // console.log("req", req.body.enc);
  // console.log("req decryptedDocument", decryptedDocument);
  const limit = 10;
  let skip = decryptedDocument.skip;
  if (isNaN(skip) || typeof skip !== "number") {
    return res.status(400).send({ error: "Invalid request. Skip value must be a number." });
  }
  // console.log("skip", skip);
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
