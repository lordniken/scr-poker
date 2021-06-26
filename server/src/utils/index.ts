import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { RedisModule } from '@nestjs-modules/ioredis';
import * as jwt from 'jsonwebtoken';
import { GlobalRepository } from './GlobalRepository';
import { deserializeArray, serialize } from 'class-transformer';
import { events } from 'src/enums';

export const config = ConfigModule.forRoot();

export const graphql = GraphQLModule.forRoot({
  debug: false,
  playground: true,
  installSubscriptionHandlers: true,
  subscriptions: {
    onDisconnect: async (_, context) => {
      const redis = GlobalRepository.getRedis();
      const { Authorization } = await context.initPromise;
      const token = Authorization?.split(' ')[1];

      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET) as {
          id: string;
        };

        redis.keys('online_*', (_, keys) => {
          keys.forEach(async (key) => {
            try {
              const onlineList = deserializeArray(String, await redis.get(key));

              await redis.set(
                key,
                serialize(onlineList.filter((user) => user !== id)),
              );
            } catch {}
          });
        });

        GlobalRepository.getPubSub().publish(events.userDisconnected, {
          userDisconnected: id,
        });
      } catch {}
    },
  },
  autoSchemaFile: 'schema.gql',
  formatError: (error: GraphQLError) => {
    const graphQLFormattedError: GraphQLFormattedError = {
      message: error.extensions?.exception?.response?.message || error.message,
    };
    return graphQLFormattedError;
  },
  context: ({ req, connection }) =>
    connection ? { req: connection.context } : { req },
});

export const postgres = TypeOrmModule.forRoot({
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
});

export const redis = RedisModule.forRoot({
  config: {
    url: `redis://${process.env.REDIS_HOST}:6379`,
  },
});
