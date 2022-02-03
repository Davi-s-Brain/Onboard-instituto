import * as request from 'supertest';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { User } from '../src/entity/user';

describe('Communication with the server', function () {
  afterEach(async () => {
    const repositories = await getConnection().getRepository(User);
    await repositories.clear();
  });

  const query = `
      query {
        hello
      } 
    `;

  it('should return Hello world', async function () {
    const expectedResponse = { data: { hello: 'Hello world' } };
    const response = await request('localhost:4001').post('/').send({ query });

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal(expectedResponse);
  });
});
