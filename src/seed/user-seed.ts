import { hashPassword } from '../confirmation/passwordHash';
import { getConnection } from 'typeorm';
import { User } from '../entity/user';

export async function databaseSeed() {
  const userRepository = getConnection().getRepository(User);
  const hashSupervisor = new hashPassword();

  for (let i = 1; i <= 30; i++) {
    const newUser = Object.assign(new User(), {
      name: `fake user`,
      email: `carlos${i}@coisa.com`,
      birthday: `${i}0-01-20${i}0`,
      password: await hashSupervisor.hash('babata123'),
    })
    await userRepository.save(newUser);
  }
  try {
    console.info('seed implemented, have a nice day');
  } catch {
    console.error('can not implement seed users');
  }
}
