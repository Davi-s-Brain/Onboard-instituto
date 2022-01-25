import { User } from "../entity/user"
import { getRepository } from "typeorm"
const bcrypt = require("bcryptjs")

export const resolvers = {
  Query: {
    users: async () => {
      const userRepository = getRepository(User)
      const users = await userRepository.find()
      return users
    }
  },
  Mutation: {
    createUser:async (_parent:any, args: {data:{name:string, email:string, birthday:string, password:string}}) => {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne({ where: { email: args.data.email } })
      
      const containsLetters = /^[A-Za-z]+$/
      const containsNumbers = /^[0-9]+$/

      const alphabet = containsLetters.exec(args.data.password)
      const number = containsNumbers.exec(args.data.password)
      const isValidPassword = args.data.password.length < 6 || alphabet || number
      
      if (isValidPassword) {
        throw new Error("A senha precisa ter ao menos 6 caracteres, uma letra e um número")
      }
      
      if (user) {
        throw new Error ("E-mail já existente. Cadastre outro e-mail.")
      }

      async function createHash(text: string): Promise<string> {
        const salt = await bcrypt.genSalt(8)
        return await bcrypt.hash(text, salt).then(() => { return bcrypt.hash(text, salt) })
      }

      const newUser = new User()
      newUser.name = args.data.name
      newUser.email = args.data.email
      newUser.birthday = args.data.birthday
      newUser.password = (await createHash(args.data.password)).toString()
      
      await userRepository.save(newUser)
      
      return newUser
    }
  }
}