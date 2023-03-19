const redis = require("redis");

const client = redis.createClient({
  url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.connect();

client.on("connect", () => {
  console.log(
    `Redis connected: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  );
});

client.on("error", (err) => console.log("Redis Client Error", err));

module.exports = client;
