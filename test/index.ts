import { setup } from "../src/setup"
import { testHello } from "./hello.test"

before(async() => {
  await setup()
})

testHello()