import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    birthday: String!
  }

  input UserInput {
    id: ID!
    name: String!
    email: String!
    birthday: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginAuth {
    login: Login
  }

  type Login {
    user: User
    token: String
  }

  type Mutation {
    createUser(data: UserInput): User!
    login(data: LoginInput): LoginAuth
  }

  type Query {
    hello: String
    users: [User]
  }
`;
