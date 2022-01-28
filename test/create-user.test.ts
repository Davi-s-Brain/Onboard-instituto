import request from "supertest"
import { expect } from "chai"

export const testCreateUser = async () => {
  const query = `
    mutation createUser($data: UserInput!) { 
      createUser(data: $data) { 
        id
        name
        email
        birthday
      }
    }
  `

  async function createUserMutation(variables:any) {
    return request('localhost:4000')
    .post('/')
    .send({query, variables: {data: variables }})
  }

  describe("test to create a user", async() => {
    it("should return an error if the password isn't valid",async () => {
      const data = { email:"testando@teste.com", name:"José", password:"abcde", birthday:"14-09-1981" }

      const response = await createUserMutation(data)

      const expectedResponse = { message: "A senha precisa ter ao menos 6 caracteres, uma letra e um número", code: 200}

      console.log(response.body.errors[0].message)

      expect(response.body.errors[0].message).to.be.equal(expectedResponse.message)
      expect(response.statusCode).to.be.equal(expectedResponse.code)
    })
  })
}