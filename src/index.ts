const { ApolloServer, gql } = require('apollo-server')
import 'reflect-metadata'

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(( { url }:{ url:string } ) => console.log( `🤓 Server started at ${url}` ) )
