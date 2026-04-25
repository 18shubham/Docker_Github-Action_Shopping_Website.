const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  }
});

client.on('error', (err) => console.log('Redis error:', err));
client.on('connect', () => console.log('Redis connected'));

const connectRedis = async () => {
  await client.connect();
};

module.exports = { client, connectRedis };
