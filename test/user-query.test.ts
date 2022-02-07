import * as request from 'supertest';
import { expect } from 'chai';
import { User } from '../src/entity/user';
import { getConnection } from 'typeorm';
import { hashPassword } from '../src/confirmation/passwordHash';
import { Authentication } from '../src/confirmation/token';

const query = `
  query Query($data: UserQuery!) { 
    user(data: $data) { 
      id
      name
      email
      }
    }
  `;

async function userQuery(variables: any, token: string) {
  return request('localhost:4001')
    .post('/')
    .send({ query, variables: { data: variables } })
    .set({ Authorization: token });
}

describe('User-query test', function () {
  let token;
  let repositories;
  let user;
  let hashSupervisor;
  let createToken;

  before(async () => {
    repositories = await getConnection().getRepository(User);
    hashSupervisor = new hashPassword();
    createToken = new Authentication();
  });

  beforeEach(async () => {
    const input = { id: 1, rememberMe: true };
    token = createToken.generate(input);

    const hashedPassword = await hashSupervisor.hash('batata321');
    const userTest = Object.assign(new User(), {
      name: 'Davi',
      email: 'davi@example.com',
      password: hashedPassword,
      birthday: '01-01-2001',
    });
    user = await repositories.save(userTest);
  });

  afterEach(async () => {
    await repositories.delete({});
  });

  it('should return an error if the token is invalid', async () => {
    const data = { id: 1 };

    const response = await userQuery(data, 'token invalid');

    const expectedResponse = { message: 'Invalid token', code: 400 };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it('should return an error if the id is invalid', async () => {
    const data = { id: -1 };

    const response = await userQuery(data, token);

    const expectedResponse = { message: 'User not found', code: 400 };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it('should get the correct data', async () => {
    const data = { id: user.id };

    const response = await userQuery(data, token);

    const expectedResponse = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    };
    expect(response.body.data.user).to.deep.equal(expectedResponse);
  });
});
