import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { User } from '../src/entity/user';
import { getConnection, getRepository } from 'typeorm';
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
  beforeEach(async () => {
    const data = { id: 1 };
    const input = { id: data.id, rememberMe: true };
    const createToken = new Authentication();
    const tokenCreated = createToken.generate(input);
    return (token = tokenCreated);
  });

  afterEach(async () => {
    const repositories = await getConnection().getRepository(User);
    await repositories.clear();
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
    const userRepository = getRepository(User);
    const hashSupervisor = new hashPassword();
    const userData = {
      name: 'Davidson',
      email: 'davidson@example.com',
      password: 'davimaneirokkk123',
      birthday: '15-15-2015',
    };
    const hashedPassword = await hashSupervisor.hash(userData.password);
    const newUser = new User();
    newUser.name = userData.name;
    newUser.email = userData.email;
    newUser.birthday = userData.birthday;
    newUser.password = hashedPassword;
    await userRepository.save(newUser);
    const data = { id: newUser.id };

    const response = await userQuery(data, token);
    await userRepository.delete(newUser);

    const expectedResponse = {
      id: newUser.id.toString(),
      name: newUser.name,
      email: newUser.email,
    };
    expect(response.body.data.user).to.deep.equal(expectedResponse);
  });
});
