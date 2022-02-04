import * as request from 'supertest';
import { expect } from 'chai';
import { User } from '../src/entity/user';
import { getConnection } from 'typeorm';
import { hashPassword } from '../src/confirmation/passwordHash';

const query = `mutation Login($data: LoginInput!) {
    login(data: $data) {
      login {
        user {
          name
          id
          email
        }
        token
      }
    }
  }`;

async function createLoginMutation(variables: any) {
  return request('localhost:4001')
    .post('/')
    .send({ query, variables: { data: variables } });
}

describe('Login tests', function () {
  let repositories;
  let user;
  let hashSupervisor

  before(async () => {
    repositories = await getConnection().getRepository(User);
    hashSupervisor = new hashPassword();
  });

  beforeEach(async () => {
    const hashedPassword = await hashSupervisor.hash('batata123');
    const userTest = Object.assign(new User(), {
      name: 'Davi',
      email: 'davi@email.com',
      password: hashedPassword,
      birthday: '16-05-1974',
    });
    user = await repositories.save(userTest);
  });

  afterEach(async () => {
    await repositories.clear();
  });

  it('should return an error if password is in the wrong format', async () => {
    const data = { email: 'davi@email.com', password: 'abcde' };

    const response = await createLoginMutation(data);

    const expectedResponse = {
      message: 'A senha precisa ter ao menos 6 caracteres, uma letra e um número',
      code: 400,
    };
    expect(response.body.errors[0].message).to.be.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code);
  });

  it("should return an error if the password doesn't match", async () => {
    const data = { email: 'davi@email.com', password: 'abcdef1' };

    const response = await createLoginMutation(data);

    const expectedResponse = { message: 'Email ou senha inválidos', code: 400 };
    expect(response.body.errors[0].message).to.be.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code);
  });

  it("should return an error if the email isn't valid", async () => {
    const data = { email: 'davi.email.com', password: '123abcd1' };

    const response = await createLoginMutation(data);

    const expectedResponse = {
      message: 'Formato de email inválido, tente no formato email@exemplo.com',
      code: 400,
    };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it("should return an error if can't find the email in database", async () => {
    const data = { email: 'davi@email.com', password: '123abcd1' };

    const response = await createLoginMutation(data);

    const expectedResponse = { message: 'Email ou senha inválidos', code: 400 };
    expect(response.body.errors[0].message).to.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.equal(expectedResponse.code);
  });

  it('should get the correct data', async () => {
    const data = { email: 'davi@email.com', password: 'batata123' };

    const response = await createLoginMutation(data);

    const expectedResponse = {
      login: {
        user: {
          id: String(user.id),
          name: user.name,
          email: user.email,
        },
        token: 'alguma coisa',
      },
    };
    expect(response.body.data.login.login.user).to.deep.equal(expectedResponse.login.user);
  });
});
