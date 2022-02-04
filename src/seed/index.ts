import { databaseSeed } from './user-seed';

export async function genereteSeed() {
  await databaseSeed();
}

genereteSeed();