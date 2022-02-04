import { hashPassword } from '../confirmation/passwordHash';
import { getRepository } from 'typeorm';
import { User } from '../entity/user';

export async function databaseSeed() {
  const userRepository = getRepository(User);
  const hashSupervisor = new hashPassword();
  const users = [];

  for (let i = 1; i <= 50; i++) {
    const newUser = new User();
    newUser.name = `fake user Carlos${i}`;
    newUser.email = `carlos${i}@coisa.com`;
    newUser.password = await hashSupervisor.hash('batata123');
    users.push(newUser);
  }
  try {
    await userRepository.save(users)
    console.info('seed implemented, have a nice day')
  } catch {
    console.error('can not implement seed users')
  }
}
