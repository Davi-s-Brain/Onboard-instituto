import * as request from 'supertest';
import { expect } from 'chai';
import { clearDatabase } from '../src/confirmation/clearDB'

export const testHello = async () => {
  describe('Communication with the server', function () {
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
      clearDatabase();
    });
  });
};
