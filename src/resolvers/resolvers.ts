import { User } from "../entity/user"
import { getRepository } from "typeorm"
import { CustomError } from "../error/error"
const bcrypt = require("bcryptjs")

export const resolvers = {
  Query: {
    hello: () => 'Hello world',

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
      const isValidPassword = /(?=.*[A-za-z])(?=.*[0-9])[A-Za-z\d]{6,}/
      const isValidEmail = /^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

       
      if (!isValidPassword.test(args.data.password)) {
        throw new CustomError("A senha precisa ter ao menos 6 caracteres, uma letra e um número", 400)
      }

      if(!isValidEmail.test(args.data.email)) {
        throw new CustomError("Formato de email inválido, tente no formato email@exemplo.com", 400)
      }
      
      if (user) {
        throw new CustomError("E-mail já existente. Cadastre outro e-mail.", 400)
      }

      async function createHash(text: string): Promise<string> {
        const salt = await bcrypt.genSalt(8)
        return bcrypt.hash(text, salt)
      }

      const newUser = new User()
      newUser.name = args.data.name
      newUser.email = args.data.email
      newUser.birthday = args.data.birthday
      newUser.password = await createHash(args.data.password)
      await userRepository.save(newUser)
      
      return newUser
    }
  }
}