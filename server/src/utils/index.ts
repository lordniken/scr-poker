import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export const config = ConfigModule.forRoot();

export const graphql = GraphQLModule.forRoot({
  debug: false,
  playground: true,
  autoSchemaFile: 'schema.gql',
  formatError: (error: GraphQLError) => {
    const graphQLFormattedError: GraphQLFormattedError = {
      message: error.extensions?.exception?.response?.message || error.message,
    };
    return graphQLFormattedError;
  },
  context: ({ req }) => ({ headers: req.headers }),
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
