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
      totalPage
      hasPastPage
      hasNextPage
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
  let totalCount;

  before(async () => {
    repositories = await getConnection().getRepository(User);
    createToken = new Authentication();
  });

  beforeEach(async () => {
    await generateSeed();
    const input = { id: 1, rememberMe: true };
    token = createToken.generate(input);
    const [users, count] = await repositories.findAndCount({ order: { name: 'ASC' } });
    seedUsers = users.map((user) => {
      return { id: String(user.id), name: user.name, email: user.email };
    });
    totalCount = count;
  });

  afterEach(async () => {
    await repositories.delete({});
  });

  it('should return an error if the token is not valid', async () => {
    const data = {};

    const response = await usersQuery(data, 'invalid token');

    const expectedResponse = { message: 'Invalid token', code: 400 };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it('should return an error if the page is negative', async () => {
    const data = { page: -1 };

    const response = await usersQuery(data, token);

    const expectedResponse = { message: 'page cannot be negative', code: 400 };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it('should return an error if the limit is invalid', async () => {
    const data = { limit: 0 };

    const response = await usersQuery(data, token);

    const expectedResponse = { message: 'the limit must be positive', code: 400 };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it('should return the correct data, first page', async () => {
    const limit = 5;
    const page = 1;
    const data = { limit, page };
    const skip = limit * (page - 1);
    const totalPage = 6;

    const response = await usersQuery(data, token);

    const expectedResponse = {
      users: seedUsers.slice(skip, skip + limit),
      page,
      totalPage,
      hasPastPage: false,
      hasNextPage: true,
    };
    expect(response.body.data.users).to.deep.equal(expectedResponse);
  });

  it('should return the correct data, middle page', async () => {
    const limit = 5;
    const page = 5;
    const data = { limit, page };
    const skip = limit * (page - 1);
    const totalPage = 6;

    const response = await usersQuery(data, token);

    const expectedResponse = {
      users: seedUsers.slice(skip, skip + limit),
      page,
      totalPage,
      hasPastPage: true,
      hasNextPage: true,
    };
    expect(response.body.data.users).to.deep.equal(expectedResponse);
  });

  it('should return the correct data, last page', async () => {
    const limit = 5;
    const page = 10;
    const data = { limit, page };
    const skip = limit * (page - 1);
    const totalPage = 6;

    const response = await usersQuery(data, token);

    const expectedResponse = {
      users: seedUsers.slice(skip, skip + limit),
      page,
      totalPage,
      hasPastPage: true,
      hasNextPage: false,
    };
    expect(response.body.data.users).to.deep.equal(expectedResponse);
  });

  it('should return an empy array if the page is higher than the last page', async () => {
    const limit = 5;
    const page = 11;
    const data = { limit, page };
    const skip = limit * (page - 1);
    const totalPage = 6;

    const response = await usersQuery(data, token);

    const expectedResponse = {
      users: seedUsers.slice(skip, skip + limit + 1),
      page,
      totalPage,
      hasPastPage: true,
      hasNextPage: false,
    };
    expect(response.body.data.users).to.deep.equal(expectedResponse);
  });
});
