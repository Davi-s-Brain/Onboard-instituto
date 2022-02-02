import { User } from "../entity/user"
import { getRepository } from "typeorm"
import { CustomError } from "../error/error"
import { validator } from "../confirmation/validator"
import { hashPassword } from "../confirmation/passwordHash"
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
    login:async (_parent:any, args: {data: {email: string, password: string}}) => {
      const { email, password } = args.data

      if (!validator.password(args.data.password)) {
        throw new CustomError("A senha precisa ter ao menos 6 caracteres, uma letra e um número", 400)
      }

      if (!validator.email(args.data.email)) {
        throw new CustomError("Formato de email inválido, tente no formato email@exemplo.com", 400)
      }

      const userRepository = getRepository(User)
      const userDatabase = await userRepository.findOne({ email })
      if (!userDatabase) {
        return new CustomError( "Email ou senha inválidos", 400 )
      }

      const hashSupervisor = new hashPassword
      const verifyPassword = await hashSupervisor.compare(password, userDatabase.password) 
      if (!verifyPassword) {
        throw new CustomError( "Email ou senha inválidos", 400 )
      }

      const token = "dado mockado por enquanto"

      const response = {
        login: {
          user: { 
            id: userDatabase.id, 
            name: userDatabase.name,
            email: userDatabase.email, 
            birthday: userDatabase.birthday
          }, 
          token
        }
      }
      console.log(userDatabase.birthday)
      return response
  },
    createUser:async (_parent:any, args: {data:{name:string, email:string, birthday:string, password:string}}) => {
      const userRepository = getRepository(User)

      const user = await userRepository.findOne({ where: { email: args.data.email } })

      if (!validator.password(args.data.password)) {
        throw new CustomError("A senha precisa ter ao menos 6 caracteres, uma letra e um número", 400)
      }

      if(!validator.email(args.data.email)) {
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