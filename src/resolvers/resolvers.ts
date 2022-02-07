import { User } from '../entity/user';
import { getRepository } from 'typeorm';
import { CustomError } from '../error/error';
import { validator } from '../confirmation/validator';
import { hashPassword } from '../confirmation/passwordHash';
import { Authentication } from '../confirmation/token';

interface CreateUser {
  name: string;
  email: string;
  birthday: string;
  password: string;
  rememberMe: boolean;
}

export const resolvers = {
  Query: {
    hello: () => 'Hello world',

    user: async (_parent: any, args: { data: { id: number } }, context: { token: string }) => {
      new Authentication().tokenValidator(context.token);
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ id: args.data.id });

      if (!user) {
        throw new CustomError('User not found', 400);
      }
      return user;
    },

    users: async (_parent: any, args: { data: { limit: number; page: number } }, context: { token: string }) => {
      new Authentication().tokenValidator(context.token);
      const take = args.data.limit ?? 1;
      const page = args.data.page ?? 15;
      const skip = take * (page - 1);

      if (page < 0) {
        throw new CustomError('page cannot be negative', 400);
      }
      if (take <= 0) {
        throw new CustomError('the limit must be positive', 400);
      }

      const userRepository = getRepository(User);
      const [users, count] = await userRepository.findAndCount({ order: { name: 'ASC' }, skip, take });

      if (!users) {
        throw new CustomError('Users not found', 400);
      }

      const totalPage = Math.floor(count / take);
      const hasPastPage = page > 1;
      const hasNextPage = page < totalPage;
      const result = {
        users,
        page,
        totalPage,
        hasPastPage,
        hasNextPage,
      };
      return result;
    },
  },
  Mutation: {
    login: async (_parent: any, args: { data: CreateUser; rememberMe: boolean }) => {
      const { email, password, rememberMe } = args.data;

      if (!validator.password(args.data.password)) {
        throw new CustomError('A senha precisa ter ao menos 6 caracteres, uma letra e um número', 400);
      }

      if (!validator.email(args.data.email)) {
        throw new CustomError('Formato de email inválido, tente no formato email@exemplo.com', 400);
      }

      const userRepository = getRepository(User);
      const userDatabase = await userRepository.findOne({ email });
      if (!userDatabase) {
        return new CustomError('Email ou senha inválidos', 400);
      }

      const hashSupervisor = new hashPassword();
      const verifyPassword = await hashSupervisor.compare(password, userDatabase.password);
      if (!verifyPassword) {
        throw new CustomError('Email ou senha inválidos', 400);
      }

      const authentication = new Authentication();
      const token = authentication.generate({ id: userDatabase.id, rememberMe });

      const response = {
        login: {
          user: {
            id: userDatabase.id,
            name: userDatabase.name,
            email: userDatabase.email,
            birthday: userDatabase.birthday,
          },
          token,
        },
      };
      return response;
    },
    createUser: async (_parent: any, args: { data: CreateUser }) => {
      const userRepository = getRepository(User);

      const user = await userRepository.findOne({ where: { email: args.data.email } });

      if (!validator.password(args.data.password)) {
        throw new CustomError('A senha precisa ter ao menos 6 caracteres, uma letra e um número', 400);
      }

      if (!validator.email(args.data.email)) {
        throw new CustomError('Formato de email inválido, tente no formato email@exemplo.com', 400);
      }

      if (user) {
        throw new CustomError('E-mail já existente. Cadastre outro e-mail.', 400);
      }

      const hashSupervisor = new hashPassword();

      const newUser = Object.assign(new User(), {
        name: args.data.name,
        email: args.data.email,
        birthday: args.data.birthday,
        password: await hashSupervisor.hash(args.data.password),
      });

      return userRepository.save(newUser);
    },
  },
};
