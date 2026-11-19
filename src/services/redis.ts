import { Redis } from "ioredis";

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
};

const redis = new Redis(redisConfig);

redis.on("error", (err) => console.error("Redis Client Error:", err));

export default redis;