const { JsonWebTokenError } = require('jsonwebtoken');
const redis = require('redis');


const client = redis.createClient({
        host: "127.0.0.1",
        port: '6379'
});
client.connect()
client.on('connect', err => {
    console.log('Connected to redis..');
})

client.on('error', (err) => {
    console.log(err.message);
})
client.on('end', () => {
    console.log('Client disconnected to redis...');
});

const redisupdate = async (collectionName, document, hash, data) => {
  try {
     var tr = eval(collectionName);
    const collection = await tr.create(document);
    console.log("Inserted a document");
    const redisResult = await client.SET(hash, data);
    console.log(redisResult);
   return { collection, redisResult };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports=redisupdate;

module.exports = {
   redisSET: async(hash,data)=> {
    try {
      const result = await client.SET(hash,data);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
redisGET: async(hash)=> {
    try {
      const result = await client.get(hash);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  redishset: async (hash, key, data) => {
    var result = JSON.stringify(data);
    try {
      const reply = await client.hSet(hash, key, result);
      return reply;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  redishexists: async (hash,key) => {
    const result = await client.hExists(hash,key);
    return result;
  },
  redishget: async (hash,key) => {
    const result = await client.hGet(hash,key);
    var reply = JSON.parse(result);
    return reply;
  },
  redisexists: async (hash) => {
    const result = await client.exists(hash);
    return result;
  },
  redisget: async (hash) => {
    const result = await client.get(hash);
    var reply = JSON.parse(result);
    return reply;
  },
 deleteData:async (hash) => {
      try {
          const result = await client.del(hash);
          return result;
      } catch (error) {
          console.error(error);
          throw error;
      }
  },
  deleteData: async (hash, field) => {
    try {
      const result = await client.HDEL(hash, key);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  redisupdate: async (hash,data) => {
    try {
      const result = await client.hSet(hash,key,data);
      if (!result) {
        return null;
      }
      return JSON.parse(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}



