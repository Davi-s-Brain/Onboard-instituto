import { hashPassword } from '../confirmation/passwordHash';
import { getConnection } from 'typeorm';
import { User } from '../entity/user';

export async function databaseSeed() {
  const userRepository = getConnection().getRepository(User);
  const hashSupervisor = new hashPassword();

  for (let i = 1; i <= 30; i++) {
    const newUser = new User();
    newUser.name = `fake user Carlos${i}`;
    newUser.email = `carlos${i}@coisa.com`;
    newUser.password = await hashSupervisor.hash('batata123');
    newUser.birthday = `${i}0-01-20${i}0`;
    await userRepository.save(newUser);
  }
  try {
    console.info('seed implemented, have a nice day');
  } catch {
    console.error('can not implement seed users');
  }
}
