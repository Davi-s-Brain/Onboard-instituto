import { createConnection, Connection } from "typeorm";

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

