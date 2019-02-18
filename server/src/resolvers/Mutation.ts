import { MutationResolvers } from '../generated/graphqlgen'
import checkSignature from '../checkSignature'

export const Mutation: MutationResolvers.Type = {
  sendChallenge: async (
    parent,
    { senderId, receiverId, score, signature },
    ctx,
  ) => {
    checkSignature(signature)

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

    return ctx.prisma.mutation.createChallenge({
      data: {
        challengeSender: { connect: { FacebookID: receiverId } },
        challengeReceiver: { connect: { FacebookID: receiverId } },
        score,
        answered: false,
      },
    })
  },
  answerChallenge: async (parent, { challengeId, score, signature }, ctx) => {
    checkSignature(signature)

    const {
      challengeSender: {
        id: { senderId },
      },
      challengeReceiver: {
        id: { receiverId },
      },
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

    return ctx.prisma.mutation.createChallenge({
      data: {
        challengeSender: { connect: { id: senderId } },
        challengeReceiver: { connect: { id: receiverId } },
        score,
        answered: false,
      },
    })
  },
}
