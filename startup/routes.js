const express = require('express');
const users = require('../routes/users');
const categories = require('../routes/categories');
const admin = require('../routes/Admin');
const images = require('../routes/images');
const addposts=require('../routes/addposts');
module.exports=function(app){
app.use(express.json());
app.use('/api/addposts',addposts);
app.use('/api/users',users);
app.use('/api/categories',categories);
app.use('/api/admin', admin);
app.use('/api/images', images);
}
