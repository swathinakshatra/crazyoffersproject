const express = require("express");
const router = express.Router();
const {Addpost,validatepost } = require("../models/addpost");
const crypto=require('../startup/crypto');



  router.post('/addpost', async (req, res) => {
    try {
      console.log('req.body--->',req.body);
      
      // console.log("hit");
      const decryptedDocument = crypto.decryptobj(req.body.enc);
        console.log("req",req.body.enc);
        console.log("req",decryptedDocument);

      const { error } = validatepost(decryptedDocument);
      if (error) return res.status(400).send(error.details[0].message);
      console.log("decryptedDocument",decryptedDocument);  
      const post = new Addpost({
       
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        price: req.body.price,
        images: req.body.images,
      });
  
      await post.save();
      return res.status(200).send(crypto.encryptobj({success:post}));
    
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error"); 
    }
  });
  router.post('/categories', async (req, res) => {
    try {
      // console.log("categories ->req.body",req.body);
    
      
      const categories = await Addpost.find().select({categories:1});
       if(!categories) return res.status(400).send('categories not found');
       const en=crypto.encryptobj({success:categories});
       const de = crypto.decryptobj(en);
      console.log(de,"de");
         return res.status(200).send(de);
      
    // return res.status(200).send(crypto.encryptobj({success:categories}));

     

    
    
    } catch (err) {
      console.error(err);
      res.status(500).send("internal server error");
    }
  });
  router.post('/allposts', async (req, res) => {
    try {
      const posts = await Addpost.find();
      res.status(200).send(posts);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });
  router.post('/delete', async (req, res) => {
    try {
     
     
      const categories = await Addpost.findByIdAndRemove({ userid }).select(categories);
      res.status(200).send(categories);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });
  router.post('/addpost', async (req, res) => {
    // console.log('req.body--->',req.body);
    // const decryptedDocument = crypto.decryptobj(req.body.enc);
    // console.log("req",req.body.enc);
    // console.log("req",decryptedDocument);
    
    const { error } = validatepost(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   const post = new Addpost({
          title: req.body.title,
          description: req.body.description,
          categories: req.body.categories,
          price: req.body.price,
          images: req.body.images,
        });
    
        await post.save();
       
        
       return res.status(200).send(crypto.encryptobj({success:post}));
      });
  
      productRoute.get('/getproduct/:name', async (req,res) => {
        try {
            const findname = req.params.name;
            const objs = await Product.find({productName:{ $regex:'.*'+findname+'.*'} });
            res.json(objs);
        } catch (error) {
            res.json({message: error});        
        }
    })

module.exports = router;
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, });
router.post('/imagecategories', upload.single('image'), async (req, res) => {
  try {
    const { error } = validatecat(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
     const category = new Image({
      categories: req.body.categories,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    const result = await category.save();
    res.send(result);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
});
router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const query = { email: req.body.email };
  const user = await Queries.findOneDocument(query, "User");
  if (user) return res.status(400).send("User already registered.");
  const users = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  };

  const result = await Queries.insertDocument("User", users);
  if (!result) return res.status(500).send("Error saving user.");

  return res.status(200).send("Registered successfully");
});
router.post("/allposts", async (req, res) => {
  const pageSize = 10;
  const pageNumber = req.body.pageNumber || 1;
  const skip = (pageNumber - 1) * pageSize;

  const posts = await Addpost.find().skip(skip).limit(pageSize);

  if (!posts || posts.length === 0) {
      return res.status(404).send("No posts found");
  }

  // res.status(200).send(crypto.encryptobj({success: posts}));
  res.status(200).send(posts);
});
// function validateSkip(skips) {
//   const schema = Joi.object({
//     skip:Joi.number().min(0).required().messages({
//     'number.min': 'Skip must be greater than or equal to 0',
//     'any.required': 'Skip is required'
//   })
// });

// return schema.validate(skips);
// }
// exports.validateSkip = validateSkip;
  
