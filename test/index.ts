const assert = require('assert')
import { ApolloServer } from "apollo-server"

before(function() {
  const server = new ApolloServer()
})

describe('Array', function() {
  it('should return a', () => {
    console.log('hello world')
  })
})