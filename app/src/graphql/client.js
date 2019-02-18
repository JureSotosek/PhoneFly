const { makePrismaBindingClass } = require('prisma-binding')


/**
 * Type Defs
*/

const typeDefs = `type Challenge {
  id: ID!
  score: Float!
  challengeSender: Player
  challengeReceivers: [Player!]!
  answered: Boolean!
}

type Mutation {
  sendChallenge(senderId: String!, receiverId: String!, score: Float!, signature: String!): Challenge!
  answerChallenge(challengeId: String!, score: Float!, signature: String!): Challenge!
}

type Player {
  id: ID!
  FacebookID: String!
  highScore: Float
  sentChallenges: [Challenge!]!
  pendingChallenges: [Challenge!]!
}

type Query {
  pendingChallenges(playerId: String!, signature: String!): [Challenge!]!
}
`

const Prisma = makePrismaBindingClass({ typeDefs })
module.exports = { Prisma }
