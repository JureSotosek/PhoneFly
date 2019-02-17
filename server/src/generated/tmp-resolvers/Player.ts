// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { PlayerResolvers } from '../graphqlgen'

export const Player: PlayerResolvers.Type = {
  ...PlayerResolvers.defaultResolvers,

  sentChallenges: (parent, args, ctx) => {
    throw new Error('Resolver not implemented')
  },
  pendingChallenges: (parent, args, ctx) => {
    throw new Error('Resolver not implemented')
  },
}
