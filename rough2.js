// const express = require("express");
// const router = express.Router();
// const { Addpost, validatepost } = require("../models/addpost");
// const crypto = require("../startup/crypto");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
// router.post("/addpost",  async (req, res) => {
//   console.log("req.body--->", req.body);
//   const decryptedDocument = crypto.decryptobj(req.body.enc);
//   console.log("req", req.body.enc);
//   console.log("req", decryptedDocument);
//   const { error } = validatepost(decryptedDocument);
//   if (error) return res.status(400).send(error.details[0].message);
//   const post = new Addpost({
//     title: decryptedDocument.title,
//     description: decryptedDocument.description,
//     categories: decryptedDocument.categories,
//     price: decryptedDocument.price,
//     images: decryptedDocument.images,
//   });
//   await post.save();
//   return res.status(200).send(crypto.encrypt("success"));
// });
// router.post("/categories", async (req, res) => {
//   // console.log("categories ->req.body",req.body);
//   const categories = await Addpost.find().select({ categories: 1 });
//   if (!categories) return res.status(400).send("categories not found");
//   //  const en=crypto.encryptobj({success:categories});
//   //  const de = crypto.decryptobj(en);
//   // console.log(de,"de");
//   //    return res.status(200).send(de);
//   return res.status(200).send(crypto.encryptobj({ success: categories }));
// });
// router.post("/latest", async (req, res) => {
//   const posts = await Addpost.find().sort({ createdAt: -1 }).limit(20);
//   if (!posts) return res.status(400).send("Posts not found");
//   res.status(200).send(crypto.encryptobj({ success: posts }));
//   // res.status(200).send(posts);
//   //console.log(posts[0].createdAt);
// });

// router.post("/allposts", async (req, res) => {
//   const pageSize = 10;
//   const pageNumber = req.body.pageNumber || 1;
//   const skip = (pageNumber - 1) * pageSize;

//   const posts = await Addpost.find().skip(skip).limit(pageSize);

//   if (!posts || posts.length === 0) {
//     return res.status(404).send("No posts found");
//   }

//   // res.status(200).send(crypto.encryptobj({success: posts}));
//   res.status(200).send(posts);
// });
// router.post("/delete", async (req, res) => {
//   const id = req.body.id;
//   const posts = await Addpost.findByIdAndRemove(id);
//   if (!posts) return res.status(400).send("post not found");
//   return res.status(200).send("post delete successfully");
// });

// module.exports = router;

// const totalPosts = await Addpost.countDocuments(); 
//    if (skip > totalPosts) { 
//       return res.status(400).send({ error: 'Invalid request. Skip value exceeds the total number of records.' });
//     }





const crypto = require("./startup/crypto");

var enc = 'U2FsdGVkX18UMFAlZVjlAAb2aDssChK2/2tysQYvf10='
var dec = crypto.decryptobj(enc)
console.log('dec',dec);






router.post("/search", async (req, res) => {
    console.log("req.body--->", req.body);
    const decryptedDocument = crypto.decryptobj(req.body.enc);
    console.log("req", req.body.enc);
    console.log("req", decryptedDocument);
  
    if (decryptedDocument.categories) {
      const category = decryptedDocument.categories;
      if (!category || category.trim() === "") {
        return res.status(400).send("Invalid or missing category");
      }
      try {
        const posts = await Addpost.find({ categories: { $regex: category, $options: "i" } });
        if (posts.length === 0) {
          return res.status(404).send("No posts found in this category");
        }
        return res.status(200).send(crypto.encryptobj({ success: posts }));
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    } else if (decryptedDocument.title) {
      const title = decryptedDocument.title;
      if (!title || title.trim() === "") {
        return res.status(400).send("Invalid or missing title");
      }
      const posts = await Addpost.find({ title: { $regex: title, $options: "i"}});
      if (!posts) return res.status(400).send("Posts not found");
      return res.status(200).send(crypto.encryptobj({ success: posts }));
    } else {
      return res.status(400).send("Invalid search parameters");
    }
  });








  // router.post("/searchtitle", async (req, res) => {

//   const title = req.body.title;
//   console.log("title", title);
//   if (!title || title.trim() === "") {
//     return res.status(400).send("Invalid or missing title");
//   }
//   const posts = await Addpost.find({ title: { $regex: title, $options: "i" } });
//   if (!posts) return res.status(400).send("Posts not found");
//   return res.status(200).send({ posts });

// });







router.post('/image', async (req, res) => {
  try {
    if (!req.body.base64image) {
      return res.status(400).send('base64image is required');
    }
    const userid = generateUserId(); 
    const path = `./images/${userid}-${Date.now()}.png`;
    const imgdata = req.body.base64image;
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(path, base64Data, { encoding: 'base64' });
    return res.status(200).send(path);
  } catch (e) {
    next(e);
  }
});






// router.post('/uploadss ', async (req, res) => {
//   const { base64String } = req.body; // assuming base64String is sent in the request body

//   try {
//     const imagePath = await base64toFile(base64String, { filePath: './uploads', fileName: 'image', types: ['png'], fileMaxSize: 3145728 });
//     res.send({ imagePath });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });




router.post('/imagesave', async (req, res) => {
  try {
    if (!req.body.base64image) {
      return res.status(400).send('base64image is required');
    }
    const { username } = req.body;
    if (!username) {
      return res.status(400).send('Username is required');
    }
    const base64Str = req.body.base64image;
    const path = `./images/${username}-${Date.now()}.png`;
    const imageBuffer = Buffer.from(base64Str, 'base64');
    await fs.promises.writeFile(path, imageBuffer);
    res.status(200).send(path);
  } catch (e) {
    console.error(e);
    res.status(500).send('Something went wrong');
  }
});



// router.post('/image', async (req, res) => {
//   try {
//     if (!req.body.base64image) {
//       return res.status(400).send('base64image is required');
//     }
//     const { userid } = req.body;
//     if (!userid) {
//       return res.status(400).send('Username is required');
//     }
//     const base64Str = req.body.base64image;
//     const path = `./images/${userid}-${Date.now()}.png`;
//     const imageBuffer = Buffer.from(
//       img.replace(/^data:image\/\w+;base64,/, ''),
//       'base64'
//     );
//     await fs.promises.writeFile(path, imageBuffer);
//     return res.status(200).send(path);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send('Something went wrong');
//   }
// });


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
     const compressedImage = await sharp(base64Data)
      .resize({ width: 200, height: 200, fit: 'inside' })
      .toFormat('jpeg', { quality: 70 })
      .toBuffer({ resolveWithObject: true, limitInputPixels: false });
      fs.writeFileSync(path, compressedImage.data, { encoding: 'base64' });
    return res.status(200).send(path);
  } catch (e) {
    res.status(400).send(e.message);
  }
});



  module.exports = router;

