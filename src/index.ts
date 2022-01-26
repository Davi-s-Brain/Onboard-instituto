import "reflect-metadata"
import { ApolloServer } from "apollo-server"
import { connection } from "./database";
import { typeDefs } from "./schema/typedefs"
import { resolvers } from "./resolvers/resolvers"

connection()
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(( { url }:{ url:string } ) => console.log( `Server started at ${url} 🤓` ) )