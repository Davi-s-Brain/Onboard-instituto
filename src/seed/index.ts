import { databaseSeed } from './user-seed';
import { setup } from '../setup';

export async function generateSeed() {
  await setup();
  await databaseSeed();
}

generateSeed();
