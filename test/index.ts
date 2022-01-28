import { setup } from "../src/setup"
import { testCreateUser } from "./create-user.test"
import { testHello } from "./hello.test"

before(async() => {
  await setup()
})

testHello()
testCreateUser()