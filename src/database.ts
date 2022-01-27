import 'reflect-metadata'
import { createConnection, ConnectionManager } from 'typeorm';
import { User } from './entity/user'

export const connection = async () => {
  const connectionManager = new ConnectionManager()

  return createConnection().then(async () => {
  const connection = connectionManager.create({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [User],
    synchronize: true
  });
  await connection.connect()
  console.log('Banco conectado com sucesso 😎')

  }).catch(error => {console.log(error)})
} 