import 'reflect-metadata'
import { ApolloServer } from 'apollo-server';
import { createConnection, ConnectionManager } from 'typeorm';
import { User } from './entity/user'
import { resolvers } from './resolvers/resolvers';
import { typeDefs } from './schema/typedefs';

const connection = async () => {
  const connectionManager = new ConnectionManager()

  return createConnection().then(async () => {
  const connection = connectionManager.create({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [User],
    synchronize: true
  });
  await connection.connect()
  console.log('Banco conectado com sucesso 😎')

  }).catch(error => {console.log(error)})
} 

const server = async () => {
  const server = new ApolloServer({ typeDefs, resolvers })
  server.listen(/*{port: 4001}*/ ).then(( { url }:{ url:string } ) => console.log( `Server started at ${url} 🤓` ) )
}

export const setup = async () => {
  await connection()
  await server()
}