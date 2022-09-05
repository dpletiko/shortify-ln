// src/server/db/redis.ts
import { Client } from 'redis-om'
// import { createClient } from 'redis'
import { env } from "../../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var redis: Promise<Client> | undefined;
}

// const _client = createClient({
//   url: env.REDIS_URL,
//   database: 11205285
// })


// const redis = async () => 
//   global.redis ||
//   await new Client().use(_client);

const redis = 
  global.redis || 
  env.REDIS_URL !== undefined ? new Client().open(env.REDIS_URL) : undefined;


if (env.NODE_ENV !== "production") {
  global.redis = redis
}


export default redis;