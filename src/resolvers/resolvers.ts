import { User } from "../entity/user";
import { getRepository } from "typeorm";

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

      if (user) {
        throw new Error ("E-mail já existente. Cadastre outro e-mail.")
      }

      const newUser = new User()
      newUser.name = args.data.name
      newUser.email = args.data.email
      newUser.birthday = args.data.birthday
      newUser.password = args.data.password
      
      await userRepository.save(newUser)
      
      return newUser
    }
  }
}