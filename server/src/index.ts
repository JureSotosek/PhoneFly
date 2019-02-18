import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma'
const { resolvers } = require('./resolvers') //type problems

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      endpoint: process.env.PHONEFLY_PRISMA_ENDPOINT,
      debug: true,
      secret: process.env.PHONEFLY_PRISMA_SECRET,
    }),
  }),
})
server.start(() => console.log('Server is running on port 4000'))
