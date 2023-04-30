const { Admin} = require("../models/Admin");
const {User} = require("../models/users");
const { Addpost } = require("../models/addpost"); 
const { Categories } = require("../models/categories"); 
const { Image } = require("../models/image"); 

module.exports = {
  insertDocument: async function (collectionName, document) {
    try {
      var tr = eval(collectionName);
      const collection = await tr.create(document);
      console.log("Inserted a document");
      return collection;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findOneDocument: async function (query, collectionName) {
    try {
      var tr = eval(collectionName);
      const document = await tr.findOne(query);
      //console.log("Found a document");
      return document;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  find: async function (collectionName) {
    try {
      var tr = eval(collectionName);
      const document = await tr.find();
      //console.log("Found a document");
      return document;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findOneAndUpdate: async function (query, update, collectionName, options) {
    try {
      var tr = eval(collectionName);
      const collection = await tr.findOneAndUpdate(query, update, options);
      console.log("Updated a document");
      return collection;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findOneAndDelete: async function (query, collectionName) {
    try {
      var tr = eval(collectionName);
      const collection = await tr.findOneAndDelete(query);
      //console.log("Deleted a document");
      return collection;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findLatestPosts: async function (collectionName, sortQuery, limitValue) {
    try {
      var tr = eval(collectionName);
      const documents = await tr.find().sort(sortQuery).limit(limitValue);
    return documents;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
 
  
};
