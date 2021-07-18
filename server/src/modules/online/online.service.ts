import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { deserializeArray, serialize } from 'class-transformer';
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

  async getOnlineList(gameId: string): Promise<UserCredentials[]> {
    const redisOnlineList = await this.redis.get(`online_${gameId}`);
    const currentOnlineList = deserializeArray(
      UserCredentials,
      redisOnlineList,
    );

    return currentOnlineList ?? [];
  }

  async update(gameId: string, user: UserCredentials): Promise<void> {
    const currentOnlineList = await this.getOnlineList(gameId);
    const isUserAlreadyOnline = Boolean(
      currentOnlineList.find((u) => u.id === user.id),
    );

    if (isUserAlreadyOnline) {
      return;
    }

    const newOnlineList = [...currentOnlineList, user].sort(
      sortByKey('username'),
    );

    await this.redis.set(`online_${gameId}`, serialize(newOnlineList));
  }

  async removeUser(gameId: string, userId: string): Promise<UserCredentials[]> {
    const currentOnlineList = await this.getOnlineList(gameId);
    const filteredOnlineList = currentOnlineList.filter(
      (user) => user.id !== userId,
    );

    await this.redis.set(`online_${gameId}`, serialize(filteredOnlineList));

    return filteredOnlineList;
  }

  async findGameIdsByUserId(userId: string): Promise<string[]> {
    const onlineList = await this.redis.keys('online_*');
    const findedGames = (
      await Promise.all(
        onlineList.map((key) => {
          return new Promise(async (resolve) => {
            try {
              const onlineList = deserializeArray(
                UserCredentials,
                await this.redis.get(key),
              );
              const isUserFinded = Boolean(
                onlineList.find((user) => user.id === userId),
              );

              if (isUserFinded) {
                const [_, gameId] = key.split('online_');

                resolve(gameId);
              }
            } catch {}

            resolve(null);
          });
        }),
      )
    ).filter(Boolean);

    return (findedGames ?? []) as string[];
  }

  async userDisonnected(token: string): Promise<void> {
    const user = this.authService.parseToken(token);
    const gameIds = await this.findGameIdsByUserId(user?.id);

    gameIds?.forEach(async (gameId) => {
      const onlineListPrev = await this.removeUser(gameId, user.id);

      await new Promise((resolve) =>
        setTimeout(resolve, USER_RECONNECT_TIMEOUT),
      );

      const onlineList = await this.getOnlineList(gameId);

      if (!Object.is(onlineList, onlineListPrev)) {
        this.pubSub.publish(events.updateOnlineList, {
          gameId,
          onlineList,
        });
      }
    });
  }
}
