const Queue = require("bull");

const queue = new Queue("audioTranscoding", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

queue.add(
  {
    audioId: 123,
    audioUrl: "https://2.com/audio.mp4",
  },
  { priority: 2 }
);
queue.add(
  {
    audioId: 456,
    audioUrl: "https://3.com/audio.mp4",
  },
  { priority: 3 }
);
queue.add(
  {
    audioId: 789,
    audioUrl: "https://4.com/audio.mp4",
  },
  { priority: 4 }
);
queue.add(
  {
    audioId: 101112,
    audioUrl: "https://1.com/video.mp4",
  },
  { priority: 1 }
);
console.log("Job added to the queue");
