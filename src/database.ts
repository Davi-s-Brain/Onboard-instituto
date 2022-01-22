import 'reflect-metadata'
import { createConnection, ConnectionManager } from 'typeorm';
import { User } from './entity/user'

const connectionManager = new ConnectionManager()

createConnection().then(async () => {
  const connection = connectionManager.create({
    type: 'postgres',
    url: 'postgres://postgres:postgres@localhost/postgres',
    entities: [User],
    synchronize: true
  });
  await connection.connect()

  const userRepository = connection.getRepository(User)

  const user = new User()
  user.nome = 'jose'
  user.email = 'jose@example.com'
  user.password = '4312'
  user.birthday = '06-06-2023'
  await userRepository.save(user)

}).catch(error => {console.log(error)})
