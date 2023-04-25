const express = require("express");
const router = express.Router();
const {userimages} = require("../models/images");  
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/image", upload.single("image"), async (req, res, next) => {
  try {
    const img = fs.readFileSync(req.file.path);
    const img_enc = img.toString('base64');
    const obj = {
      userImage: {
        data: new Buffer.from(img_enc, 'base64'),
        contentType: "image/jpg",
      },
    };
    const newimage = new userimages(obj);
    await newimage.save();
    res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});
  module.exports = router;
