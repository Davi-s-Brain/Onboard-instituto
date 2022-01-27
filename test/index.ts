const request = require("supertest")
const { expect } = require('chai')
  import { ApolloServer, gql } from "apollo-server"

describe('Communication with the server', function() {
  before(function() {

    const typeDefs = gql `
      type Query {
        hello: String
      }
    `
    
    const resolvers = {
      Query: {
        hello: () => 'Hello world'
      }
    }
  
    const server = new ApolloServer({typeDefs, resolvers})
    server.listen().then(( { url }:{ url:string } ) => console.log( `Server started at ${url} 🤓` ) )
  })

  const query = `
    query {
      hello
    } 
  `

  it('should return Hello world', async function() {
    const expectedResponse = {"data": {"hello": "Hello world"}}
    const response = await request('localhost:4000').post('/').send({query})
    
    expect(response.statusCode).to.equal(200)
    expect(JSON.stringify(response.body)).to.equal(JSON.stringify(expectedResponse))
    console.log(JSON.stringify(response.body))
  })  
})