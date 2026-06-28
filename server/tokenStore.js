import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const tokenStore = {
  async get(token) {
    return await redis.get(token);
  },

  async findBySessionId(sessionId) {
    const keys = await redis.keys('token:*');
    for (const key of keys) {
      const record = await redis.get(key);
      if (record?.sessionId === sessionId) {
        return { token: key.replace('token:', ''), record };
      }
    }
    return null;
  },

  async set(token, record) {
    await redis.set(`token:${token}`, record);
  },

  async incrementDownloads(token) {
    const record = await redis.get(`token:${token}`);
    if (record) {
      record.downloads = (record.downloads || 0) + 1;
      await redis.set(`token:${token}`, record);
    }
  },
};