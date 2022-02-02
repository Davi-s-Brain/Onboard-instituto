import { getConnection, getRepository } from "typeorm"
import { User } from "../src/entity/user"
import { setup } from "../src/setup"
import { testCreateUser } from "./create-user.test"
import { testHello } from "./hello.test"
import { testlogin } from "./login.test"

before(async() => {
  await setup()
})

testHello()
testCreateUser()
testlogin()

afterEach(async() => {
  const repositories = await getConnection().getRepository(User)
  await repositories.clear()
})