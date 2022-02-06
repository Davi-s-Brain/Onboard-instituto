import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID
    name: String!
    email: String!
    password: String!
    birthday: String!
  }

  input UserInput {
    name: String!
    email: String!
    birthday: String!
    password: String!
  }

  input UserQuery {
    id: ID!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  type LoginAuth {
    login: Login
  }

  type Login {
    user: User
    token: String
  }

  type Mutation {
    createUser(data: UserInput): User
    login(data: LoginInput): LoginAuth
  }

  type Query {
    hello: String
    user(data: UserQuery!): User 
    users: [User]
  }
`;
