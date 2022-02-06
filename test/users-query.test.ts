import * as request from 'supertest';
import { expect } from 'chai';
import { User } from '../src/entity/user';
import { getConnection, Repository } from 'typeorm';
import { Authentication } from '../src/confirmation/token';
import { generateSeed } from '../src/seed/index';

const query = `
  query Users($data: UsersQuery!) {
    users(data: $data) {
      users {
        id
        name
        email 
      }
      page
      totalPages
    }
  }
`;

async function usersQuery(variables: any, token: string) {
  return request('localhost:4001')
    .post('/')
    .send({ query, variables: { data: variables } })
    .set({ Authorization: token });
}

describe('Users-query test', function () {
  let token;
  let createToken;
  let repositories;
  let seedUsers;
  let totalCount: number;

  before(async () => {
    await generateSeed()
    repositories = await getConnection().getRepository(User);
    createToken = new Authentication();
  });

  beforeEach(async () => {
    const input = { id: 1, rememberMe: true };
    token = createToken.generate(input);
  });

  afterEach(async () => {
    await repositories.clear();
  });
});
