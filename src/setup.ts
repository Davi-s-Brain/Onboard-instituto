import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { createConnection, ConnectionManager } from 'typeorm';
import { User } from './entity/user';
import { resolvers } from './resolvers/resolvers';
import { typeDefs } from './schema/typedefs';
import * as dotenv from 'dotenv';

const isTest: boolean = process.env.TEST === 'true';
dotenv.config({ path: process.cwd() + (isTest ? '/.env.test' : '/.env') });

const connection = async () => {
  const connectionManager = new ConnectionManager();

  return createConnection()
    .then(async () => {
      const connection = connectionManager.create({
        type: 'postgres',
        url: process.env.DB_URL,
        entities: [User],
        synchronize: true,
      });
      await connection.connect();
      console.log('Banco conectado com sucesso 😎');
    })
    .catch((error) => {
      console.log(error);
    });
};

const server = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      token: req.headers.authorization,
    }),
  });
  server
    .listen({ port: process.env.PORT })
    .then(({ url }: { url: string }) => console.log(`Server started at ${url} 🤓`));
};

export const setup = async () => {
  await connection();
  await server();
};
