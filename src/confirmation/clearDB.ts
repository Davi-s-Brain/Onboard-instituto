import { getConnection } from 'typeorm';
import { User } from '../entity/user';

export const clearDatabase = () => {
  afterEach(async () => {
    const repositories = await getConnection().getRepository(User);
    await repositories.clear();
  });
};
