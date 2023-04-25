//const Queue = require("bull");

// const queue = new Queue("audioTranscoding", {
//   redis: {
//     host: "127.0.0.1",
//     port: 6379,
//   },
// });

// queue.process(async (job) => {
//   console.log(`Transcoding audio with ID: ${job.data.audioId}`);
//   console.log(`Audio URL: ${job.data.audioUrl}`);

//   return Promise.resolve();
// });
// module.exports=consumer;