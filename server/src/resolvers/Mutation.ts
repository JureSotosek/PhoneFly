import { MutationResolvers } from '../generated/graphqlgen'
import verifySignature from '../verifySignature'

export const Mutation: MutationResolvers.Type = {
  sendChallenge: async (_, { receiverId, score, signature }, ctx, info) => {
    const { player_id: senderId } = verifySignature(signature)

    await ctx.prisma.mutation.upsertPlayer({
      where: { FacebookID: senderId },
      create: { FacebookID: senderId },
      update: { FacebookID: senderId },
    })

    await ctx.prisma.mutation.upsertPlayer({
      where: { FacebookID: receiverId },
      create: { FacebookID: receiverId },
      update: { FacebookID: receiverId },
    })

    return ctx.prisma.mutation.createChallenge(
      {
        data: {
          challengeSender: { connect: { FacebookID: senderId } },
          challengeReceiver: { connect: { FacebookID: receiverId } },
          score,
          answered: false,
        },
      },
      info,
    )
  },
  answerChallenge: async (_, { challengeId, score, signature }, ctx, info) => {
    verifySignature(signature)

    const {
      challengeSender: { id: senderId },
      challengeReceiver: { id: receiverId },
    } = await ctx.prisma.mutation.updateChallenge(
      {
        where: { id: challengeId },
        data: { answered: true },
      },
      `{ 
        challengeSender { 
          id
        } challengeReceiver { 
          id 
        }
       }`,
    )

    return ctx.prisma.mutation.createChallenge(
      {
        data: {
          challengeSender: { connect: { id: senderId } },
          challengeReceiver: { connect: { id: receiverId } },
          score,
          answered: false,
        },
      },
      info,
    )
  },
}
