import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { events } from 'src/enums';
import { UserCredentials } from 'src/models';
import { sortByKey } from 'src/utils/sort';
import { AuthService } from '../auth/auth.service';

const USER_RECONNECT_TIMEOUT = 2000;
@Injectable()
export class OnlineService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private readonly authService: AuthService,
  ) {
    this.pubSub.subscribe(
      events.userDisconnected,
      this.userDisonnected.bind(this),
      {},
    );
  }

  async getOnlineListAsMap(gameId: string): Promise<Map<string, string>> {
    const redisOnlineList = await this.redis.hgetall(`online_${gameId}`);

    return new Map(Object.entries(redisOnlineList));
  }

  async getOnlineList(gameId: string): Promise<UserCredentials[]> {
    const onlineList = await this.getOnlineListAsMap(gameId);
    const normalizedOnlineList = Array.from(onlineList.entries()).map(
      ([id, username]) => ({
        id,
        username,
      }),
    );

    return normalizedOnlineList.sort(sortByKey('username'));
  }

  async addUser(gameId: string, user: UserCredentials): Promise<void> {
    const currentOnlineList = await this.getOnlineListAsMap(gameId);

    if (currentOnlineList.has(user.id)) {
      return;
    }

    currentOnlineList.set(user.id, user.username);
    await this.redis.hset(`online_${gameId}`, currentOnlineList);
  }

  async removeUser(gameId: string, userId: string): Promise<void> {
    const currentOnlineList = await this.getOnlineListAsMap(gameId);

    currentOnlineList.delete(userId);

    if (currentOnlineList.size) {
      await this.redis.hdel(`online_${gameId}`, userId);

      return;
    }

    await this.redis.del(`online_${gameId}`);
  }

  async findGameIdsByUserId(userId: string): Promise<string[]> {
    const onlineList = await this.redis.keys('online_*');
    const findedGames = (
      await Promise.all(
        onlineList.map((key) => {
          return new Promise(async (resolve) => {
            const [_, gameId] = key.split('online_');
            const onlineList = await this.getOnlineListAsMap(gameId);

            if (onlineList.has(userId)) {
              resolve(gameId);
            }

            resolve(null);
          });
        }),
      )
    ).filter(Boolean);

    return (findedGames ?? []) as string[];
  }

  async userDisonnected(token: string): Promise<void> {
    const user = this.authService.parseToken(token);

    if (!user) {
      return;
    }

    const gameIds = await this.findGameIdsByUserId(user.id);

    gameIds?.forEach(async (gameId) => {
      await this.removeUser(gameId, user.id);
      const onlineListPrev = await this.getOnlineList(gameId);

      await new Promise((resolve) =>
        setTimeout(resolve, USER_RECONNECT_TIMEOUT),
      );
      const onlineList = await this.getOnlineList(gameId);

      if (JSON.stringify(onlineList) === JSON.stringify(onlineListPrev)) {
        this.pubSub.publish(events.updateOnlineList, {
          gameId,
          onlineList,
        });
      }
    });
  }
}
