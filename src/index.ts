import "reflect-metadata"
import { ApolloServer } from "apollo-server"
import { setup } from "./setup";
import { typeDefs } from "./schema/typedefs"
import { resolvers } from "./resolvers/resolvers"

setup()
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(( { url }:{ url:string } ) => console.log( `Server started at ${url} 🤓` ) )