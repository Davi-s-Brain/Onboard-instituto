import "reflect-metadata"
const { ApolloServer, gql } = require("apollo-server")


const typeDefs = gql`

  type User {
    nome: String
    email: String
    password: String
    birthday: String
  }

  type Mutation {
    createUser(nome: String, email: String, birthday: String, password: String): User!
  }

  type Query {
    hello: String
    users: [User]
  } 
`;

const resolvers = {
  Query: {
      hello: () => "hello",
      users: () => [
        {_id: '1', nome:"davi", email: "davi@exemplo.com", birthday: "20-06-2541"}
      ]
    }
  }


const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(( { url }:{ url:string } ) => console.log( `🤓 Server started at ${url}` ) )