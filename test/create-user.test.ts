import request from "supertest"
import { expect } from "chai"
import { User } from "../src/entity/user"
import { getRepository } from "typeorm"
const bcrypt = require("bcryptjs")

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
    return request('localhost:4001')
    .post('/')
    .send({query, variables: {data: variables }})
  }

  describe("test to create a user", async() => {
    it("should return an error if the password isn't valid",async () => {
      const data = { email:"testando@teste.com", name:"José", password:"abcde", birthday:"14-09-1981" }
      const response = await createUserMutation(data)

      const expectedResponse = { 
        message: "A senha precisa ter ao menos 6 caracteres, uma letra e um número", 
        code: 200
      }

      expect(response.body.errors[0].message).to.be.equal(expectedResponse.message)
      expect(response.statusCode).to.be.equal(expectedResponse.code)
    })

    it("should return an error if the email is invalid", async() => {
      const data = { email: "testadas.com", name: "André", password: "abc1234", birthday:"14-08-1932"}
      const response = await createUserMutation(data)

      const expectedResponse = { 
        message: "Formato de email inválido, tente no formato email@exemplo.com",
        code: 200
      }

      expect(response.body.errors[0].message).to.be.equal(expectedResponse.message)
      expect(response.statusCode).to.be.equal(expectedResponse.code)
    })

    it("should save user at database and return user name and email at response",async () => {
      const userRepository = getRepository(User)
      const data = { email: "davi@example.com", name: "Hermanoteu", password: "1234acbd", birthday:"28-06-2002"}

      const response = await createUserMutation(data)
      const userSaved: User | undefined = await userRepository.findOne( { email: data.email } )
      const isPasswordEqual = await bcrypt.compare(data.password, userSaved!.password)  
      await userRepository.delete(userSaved!)
      const expectedResponse = data

      expect(response.body.data.createUser).to.deep.equal({
          id: userSaved!.id.toString(),
          name: userSaved!.name,
          email: userSaved!.email,
          birthday: userSaved!.birthday,
      })
      expect(response.body.data.createUser).to.deep.equal({
        id: userSaved!.id.toString(),
        name: expectedResponse.name,
        email: expectedResponse.email,
        birthday: expectedResponse.birthday,
      })
      expect(isPasswordEqual).to.equal(true)
      expect(userSaved!.password).to.not.equal(data.password)
    })

    it("should return an error if the user already exists", async () => {
      const userRepository = getRepository(User)
      async function createHash(text: string): Promise<string> {
        const salt = await bcrypt.genSalt(8)
        return bcrypt.hash(text, salt)
      }

      const data = { 
        email: "davi@example.com",  
        name: "Davi", 
        password: await createHash("abacate123"), 
        birthday:"14-11-2004"
      }
      const response = await createUserMutation(data)
      const expectedResponse = { message: "E-mail já existente. Cadastre outro e-mail.", code: 200}
      await userRepository.save(data)
      
      expect(response.body.errors[0].message).to.be.equal(expectedResponse.message)
      expect(response.statusCode).to.be.equal(expectedResponse.code)
    })
  })
}
