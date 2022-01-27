import request from "supertest"
import { expect } from "chai"

export const testHello = async () => {
  describe('Communication with the server', function() {

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
}

