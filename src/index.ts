import "reflect-metadata"
import { ApolloServer, gql } from "apollo-server"
import { getRepository } from "typeorm";
import { User } from "./entity/user";
import { connection } from "./database";

const typeDefs = gql`

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    birthday: String!
  }

  input UserInput {
    name: String!, 
    email: String!, 
    birthday: String!, 
    password: String!
  }

  type Mutation {
    createUser(data: UserInput): User!
  }

  type Query {
    users: [User]
  } 
`;

const resolvers = {
  Query: {
    users: async () => {
      const userRepository = getRepository(User)
      const users = await userRepository.find()
      return users
    }
  },
  Mutation: {
    createUser:async (_parent:any, args: {data:{name:string, email:string, birthday:string, password:string}}) => {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne({ where: { email: args.data.email } })

      if (user) {
        throw new Error ("E-mail já existente. Cadastre outro e-mail.")
      }

      const newUser = new User()
      newUser.name = args.data.name
      newUser.email = args.data.email
      newUser.birthday = args.data.birthday
      newUser.password = args.data.password
      
      await userRepository.save(newUser)
      
      return newUser
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
connection()
server.listen().then(( { url }:{ url:string } ) => console.log( `🤓 Server started at ${url}` ) )