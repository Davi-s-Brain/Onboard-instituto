import { hashPassword } from '../confirmation/passwordHash';
import { getConnection } from 'typeorm';
import { User } from '../entity/user';
import { faker } from '@faker-js/faker';

export async function databaseSeed() {
  const userRepository = getConnection().getRepository(User);
  const hashSupervisor = new hashPassword();

  const generateBirthday = () => {
    return `${Math.floor(Math.random() * (31 - 1) + 1)}-${Math.floor(Math.random() * (12 - 1) + 1)}-${Math.floor(
      Math.random() * (2022 - 1500) + 1500,
    )}`;
  };

  for (let i = 1; i <= 30; i++) {
    const newUser = Object.assign(new User(), {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      birthday: `${generateBirthday()}`, 
      password: await hashSupervisor.hash(faker.internet.password()),
    });
    await userRepository.save(newUser);
  }
  try {
    console.info('seed implemented, have a nice day');
  } catch {
    console.error('can not implement seed users');
  }
}
