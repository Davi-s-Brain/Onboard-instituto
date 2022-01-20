import 'reflect-metadata'
import { createConnection, ConnectionManager } from 'typeorm';
import { User } from './entity/user'

const connectionManager = new ConnectionManager()

createConnection().then(async () => {
  const connection = connectionManager.create({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [User]
  });
  await connection.connect()
  

}).catch(error => {console.log(error)})
