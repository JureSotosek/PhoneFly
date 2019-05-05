import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma'
import { resolvers } from './resolvers' //type problems

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT,
      debug: true,
      secret: process.env.PRISMA_SECRET,
    }),
  }),
})
server.start(() => console.log('Server is running on http://localhost:4000'))
