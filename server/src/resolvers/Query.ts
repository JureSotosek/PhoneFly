import { QueryResolvers } from '../generated/graphqlgen'
import verifySignature from '../verifySignature'

export const Query: QueryResolvers.Type = {
  pendingChallenges: (_, { signature }, ctx) => {
    const { player_id: playerId } = verifySignature(signature)

    return ctx.prisma.query.challenges({
      where: { challengeReceiver: { FacebookID: playerId }, answered: false },
    })
  },
}
