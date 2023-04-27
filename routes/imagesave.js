const express = require("express");
const router = express.Router();
const fs = require("fs");
const sharp = require('sharp');
router.post('/image', async (req, res) => {
  try {
    if (!req.body.base64image || !req.body.userid) {
      return res.status(400).send('base64image and userid are required');
    }
    const imgFormat = req.body.base64image.split(';')[0].split('/')[1];
    if (![ 'jpg', 'jpeg','png'].includes(imgFormat)) {
      return res.status(400).send('Invalid image format. Allowed formats are png, jpg, jpeg.');
    }
    const base64Image = req.body.base64image.split(',')[1];
    const imgBuffer = Buffer.from(base64Image, 'base64');
    const imgSize = imgBuffer.length / 1024; 
    const minSize = 5; 
    const maxSize = 10000; 
    if (imgSize < minSize || imgSize > maxSize) {
      return res.status(400).send(`Invalid image size. Image size should be between ${minSize} KB and ${maxSize} KB.`);
    }
    const {userid} = req.body;
    const dir = './images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const files = fs.readdirSync(dir);
    const existingImage = files.find(file => file.startsWith(userid));
    if (existingImage) {
      fs.unlinkSync(`${dir}/${existingImage}`);
    }
    const path = `${dir}/${userid}.png`;
    const imgdata = req.body.base64image;
    const base64Data = Buffer.from(imgdata.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const compressedImage = await sharp(base64Data).resize({ width: 200, height: 200, fit: 'inside' }).toFormat('jpeg', { quality: 70 }) .toBuffer({ resolveWithObject: true, limitInputPixels: false });
   fs.writeFileSync(path, compressedImage.data, { encoding: 'base64' });
    return res.status(200).send(path);
  } catch (e) {
   return res.status(400).send(e.message);
  }
});

module.exports = router;

