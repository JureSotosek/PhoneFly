import { QueryResolvers } from '../generated/graphqlgen'
import checkSignature from '../checkSignature'

export const Query: QueryResolvers.Type = {
  pendingChallenges: (parent, { playerId, signature }, ctx) => {
    checkSignature(signature)

    return ctx.prisma.query.challenges({
      where: { challengeReceiver: { FacebookID: playerId }, answered: false },
    })
  },
}
