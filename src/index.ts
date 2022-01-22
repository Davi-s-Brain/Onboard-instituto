import "reflect-metadata"
import { ApolloServer, gql } from "apollo-server"
import { getRepository } from "typeorm";
import { User } from "./entity/user";

const typeDefs = gql`

  type User {
    id: ID!
    nome: String!
    email: String!
    password: String!
    birthday: String!
  }

  input UserInput {
    nome: String!, 
    email: String!, 
    birthday: String!, 
    password: String!
  }

  type Mutation {
    createUser(data: UserInput): User!
  }

  type Query {
    Mutation: Query
    user: [User]
  } 
`;

const resolvers = {
  Query: {

    Mutation: {
      createUser:async (_:any, args: any) => {
          const newUser = {
          nome: args.nome, 
          email: args.email,
          birthday: args.birthday,
          password: args.password
        } 

        const userRepository = getRepository(User)
        
        const user = async () => {
          await userRepository.findOne(1)
        }

        async () => {
          await userRepository.save(newUser)
        }
        return user
          
      }
    }
  }
}


const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(( { url }:{ url:string } ) => console.log( `🤓 Server started at ${url}` ) )