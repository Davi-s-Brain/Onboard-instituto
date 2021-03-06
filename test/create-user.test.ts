import * as request from 'supertest';
import { expect } from 'chai';
import { User } from '../src/entity/user';
import { getConnection, getRepository } from 'typeorm';
import { hashPassword } from '../src/confirmation/passwordHash';

const query = `
    mutation createUser($data: UserInput!) { 
      createUser(data: $data) { 
        id
        name
        email
        birthday
      }
    }
  `;

async function createUserMutation(variables: any) {
  return request('localhost:4001')
    .post('/')
    .send({ query, variables: { data: variables } });
}

describe('test to create a user', function () {
  let repositories;
  let user;
  let hashSupervisor;

  before(async () => {
    repositories = await getConnection().getRepository(User);
    hashSupervisor = new hashPassword();
  });

  beforeEach(async () => {
    const hashedPassword = await hashSupervisor.hash('batata123');
    const userTest = Object.assign(new User(), {
      name: 'Davi',
      email: 'email@email.com',
      password: hashedPassword,
      birthday: '16-05-1974',
    });
    user = await repositories.save(userTest);
  });

  afterEach(async () => {
    await repositories.delete({});
  });

  it("should return an error if the password isn't valid", async () => {
    const data = { email: 'testando@teste.com', name: 'José', password: 'abcde', birthday: '14-09-1981' };

    const response = await createUserMutation(data);

    const expectedResponse = {
      message: 'A senha precisa ter ao menos 6 caracteres, uma letra e um número',
      code: 400,
    };
    expect(response.body.errors[0].message).to.be.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code);
  });

  it('should return an error if the email is invalid', async () => {
    const data = { email: 'testadas.com', name: 'André', password: 'abc1234', birthday: '14-08-1932' };

    const response = await createUserMutation(data);

    const expectedResponse = {
      message: 'Formato de email inválido, tente no formato email@exemplo.com',
      code: 400,
    };
    expect(response.body.errors[0].message).to.be.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code);
  });

  it('should save user at database and return user name and email at response', async () => {
    const data = { email: 'davi@example.com', name: 'Hermanoteu', password: '1234acbd', birthday: '28-06-2002' };

    const response = await createUserMutation(data);
    const userSaved = await repositories.findOne({ email: data.email });

    const isPasswordEqual = await hashSupervisor.compare(data.password, userSaved.password);
    const expectedResponse = data;
    expect(response.body.data.createUser).to.deep.equal({
      id: userSaved?.id.toString(),
      name: userSaved?.name,
      email: userSaved?.email,
      birthday: userSaved?.birthday,
    });
    expect(response.body.data.createUser).to.deep.equal({
      id: userSaved.id.toString(),
      name: expectedResponse.name,
      email: expectedResponse.email,
      birthday: expectedResponse.birthday,
    });
    expect(isPasswordEqual).to.equal(true);
  });

  it('should return an error if the user already exists', async () => {
    const data = {
      email: 'email@email.com',
      name: 'Josenildo',
      password: 'ssass12A',
      birthday: '21-04-2002',
    };

    const response = await createUserMutation(data);

    const expectedResponse = { message: 'E-mail já existente. Cadastre outro e-mail.', code: 400 };
    expect(response.body.errors[0].message).to.be.equal(expectedResponse.message);
    expect(response.body.errors[0].extensions.exception.code).to.be.equal(expectedResponse.code);
  });
});
