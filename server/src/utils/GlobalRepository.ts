import { createRedisConnection, Redis } from '@nestjs-modules/ioredis';
import { PubSub } from 'graphql-subscriptions';

export class GlobalRepository {
  private static redis: Redis;
  private static pubSub: PubSub;

  public static getRedis(): Redis {
    if (!this.redis) {
      this.redis = createRedisConnection({
        config: {
          url: `redis://${process.env.REDIS_HOST}:6379`,
        },
      });
    }

    return this.redis;
  }

  public static getPubSub(): PubSub {
    if (!this.pubSub) {
      this.pubSub = new PubSub();
    }

    return this.pubSub;
  }
}
