import { gql } from 'apollo-server'

export const typeDefs = gql`
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
    hello: String
    users: [User],
  } 
`