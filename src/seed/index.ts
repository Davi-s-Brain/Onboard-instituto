import { databaseSeed } from './user-seed';

export async function generateSeed() {
  await databaseSeed();
}

generateSeed();
