const express = require('express');
const users = require('../routes/users');
const categories = require('../routes/categories');
const usersregistration = require('../routes/usersregistration');
const auth = require('../routes/auth');
const login = require('../routes/login');
const images = require('../routes/images');
const posts=require('../routes/post');
const image=require('../routes/image');
const imgs=require('../routes/imgs');
const imagesave=require('../routes/imagesave');
//const error=require('../middleware/error');
const addposts=require('../routes/addposts');
module.exports=function(app){
app.use(express.json());
app.use('/api/addposts',addposts);
app.use('/api/imagesave',imagesave);
app.use('/api/users',users);
app.use('/api/categories',categories);
app.use('/api/usersregistration', usersregistration);
app.use('/api/login', login);
app.use('/api/imgs', imgs);
app.use('/api/auth', auth);
app.use('/api/images', images);
app.use('/api/image',image);
app.use('/api/posts',posts);
//app.use(error);
}