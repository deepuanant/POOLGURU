const { createClient } = require('redis');
require('dotenv').config();

// Create a Redis client
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST, // Redis server host from environment variables
    port: process.env.REDIS_PORT, // Redis server port from environment variables
  },
  password: process.env.REDIS_PASSWORD, // Redis password from environment variables (if applicable)
  tls: process.env.REDIS_TLS === 'true' ? {} : null, // Use TLS if required by Upstash
});

// Handle connection events
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function connectRedis() {
  try {
    await client.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Redis connection failed', error);
  }
}

// Function to get Redis client
function getClient() {
  return client;
}

module.exports = {
  getClient,
  connectRedis,
};
