import { createConnection, Connection } from "typeorm";
import { User } from "./user"

const connection = async () => {
  await createConnection({
    type: "mysql",
    host: "localhost",
    port: 5432,
    username: "davi",
    password: "davi",
    database: "my_project"
  });
}

