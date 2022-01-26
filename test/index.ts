const assert = require('assert')
import { ApolloServer, gql } from "apollo-server"

before(function() {

  const typeDefs = gql `
    type Query {
      hello: string
    }
  `

  const resolvers = {
    Query: {
      resolved: () => {console.log('Hello')}
    }
  }

  const server = new ApolloServer(typeDefs, resolvers)
})

describe('Array', function() {
  it('should return a', () => {
    console.log('hello world')
  })
})