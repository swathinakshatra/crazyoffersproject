const express = require("express");
const router = express.Router();
const {img} = require("../models/image");
const fs = require("fs");

router.post("/upload", async (req, res) => {
  try {
    const { username, imageData } = req.body;
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const bufferData = Buffer.from(base64Data, "base64");
    const filename = `${username}.png`;
    const path = `./uploads/${filename}`;
    fs.writeFileSync(path, bufferData);
    const newImage = new img({
      username,
      imageData,
    });
    await newImage.save();
    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

module.exports = router;