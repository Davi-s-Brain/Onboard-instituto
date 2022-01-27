import request from "supertest"
import { expect } from "chai"
import { ApolloServer } from "apollo-server"
import { typeDefs } from "../src/schema/typedefs"
import { resolvers } from "../src/resolvers/resolvers"
import { connection } from "../src/database"

describe('Communication with the server', function() {
  before(async function() {
    await connection()
    const server = new ApolloServer({ typeDefs, resolvers })
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
    expect(response.body).to.deep.equal(expectedResponse)
  })  
})