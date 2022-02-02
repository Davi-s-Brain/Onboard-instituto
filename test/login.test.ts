import request from "supertest"
import { expect } from "chai"
import { User } from "../src/entity/user"
import { getRepository } from "typeorm"
import { hashPassword } from "../src/confirmation/passwordHash"

export const testlogin = async () => {
  const query = `mutation Login($data: LoginInput!) {
    login(data: $data) {
      login {
        user {
          name
          id
          email
        }
        token
      }
    }
  }`
  
  async function createLoginMutation(variables:any) {
    return request("localhost:4001")
    .post("/")
    .send({ query, variables: { data:variables } })
  }

  describe("Login tests", async () => {
    it("should return an error if password is in the wrong format", async () => {
      const data = { email:"davi@email.com", password:"abcde" }

      const response = await createLoginMutation(data)

      const expectedResponse = { 
        message:"A senha precisa ter ao menos 6 caracteres, uma letra e um número", 
        code:400 
      }
      expect(response.body.errors[0].message).to.be.equal(expectedResponse.message)
      expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code)
    })

    it("should return ab error if the password doesn't match", async () => {
      const userRepository = getRepository(User)
      const hashSupervisor = new hashPassword
      const data = { email: "davi@email.com", password: "abcdef1"}
      const dataUserTest = { name: "Davi", email: "davi@email.com", password: "abcdef2", birthday:"15-06-2001"}
      const hashedPassword = await hashSupervisor.hash(dataUserTest.password)

      const testUser = new User()
      testUser.name = dataUserTest.name
      testUser.email = dataUserTest.email
      testUser.birthday = dataUserTest.birthday
      testUser.password = hashedPassword
      await userRepository.save(testUser)
      const response = await createLoginMutation(data)
      await userRepository.save(testUser)

      const expectedResponse = { message:"Email ou senha inválidos", code: 400}
      expect(response.body.errors[0].message).to.be.equal(expectedResponse.message)
      expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code)
    })

    it("should return an arror if the email isn't valid", async () => {
      const data = { email: "davi.email.com", password: "123abcd1" }

      const response = await createLoginMutation(data)

      const expectedResponse = { 
        message: "Formato de email inválido, tente no formato email@exemplo.com", 
        code: 400
      }
      expect(response.body.errors[0].message).to.equal(expectedResponse.message);
      expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);  
    })

    it("should return an error if can't find the email in database", async () => {
      const data = { email:"davi@email.com", password:"123abcd1"}

      const response = await createLoginMutation(data)

      const expectedResponse = { message:"Email ou senha inválidos", code: 400}
      expect(response.body.errors[0].message).to.equal(expectedResponse.message);
      expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);  
    })

    it("should get the correct data", async () => {
      const userRepository = getRepository(User)
      const hashSupervisor = new hashPassword()
      const data = { email:"davi@email.com", password:"123abcd" }
      const dataUserTest = { email:"davi@email.com", password:"123abcd", name:"Davi", birthday:"16-05-1974" }
      const hashedPassword = await hashSupervisor.hash(dataUserTest.password)
      
      const userTest = new User()
      userTest.name = dataUserTest.name
      userTest.email = dataUserTest.email
      userTest.birthday = dataUserTest.birthday
      userTest.password = hashedPassword
      await userRepository.save(userTest)

      const response = await createLoginMutation(data) 
      await userRepository.delete(userTest)

      const expectedResponse = {
        login: {
          user: {
            id: userTest.id.toString(),
            name: userTest.name,
            email: userTest.email
          },
          token: 'alguma coisa'
        },
      }
      
      expect(response.body.data.login.login.user).to.deep.equal(expectedResponse.login.user)
    })
  })
}