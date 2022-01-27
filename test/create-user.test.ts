import request from "supertest"
import { expect } from "chai"

const query = `
  mutation createUser { 
    createUser { 
      id
      nome
      email
    }
  }
`
async function createUserMutation(variables:any) {
  return request('localgost:4000')
    .post('/')
    .send(query)
}

describe("should verify a new user", async() => {

})