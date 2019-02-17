// Code generated by github.com/prisma/graphqlgen, DO NOT EDIT.

import { GraphQLResolveInfo } from 'graphql'
import { Challenge, Player, Context } from '../types'

export namespace QueryResolvers {
  export const defaultResolvers = {}

  export interface ArgsPendingChallenges {
    playerId: string
    signature: string
  }

  export type PendingChallengesResolver =
    | ((
        parent: undefined,
        args: ArgsPendingChallenges,
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Challenge[] | Promise<Challenge[]>)
    | {
        fragment: string
        resolve: (
          parent: undefined,
          args: ArgsPendingChallenges,
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge[] | Promise<Challenge[]>
      }

  export interface Type {
    pendingChallenges:
      | ((
          parent: undefined,
          args: ArgsPendingChallenges,
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge[] | Promise<Challenge[]>)
      | {
          fragment: string
          resolve: (
            parent: undefined,
            args: ArgsPendingChallenges,
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Challenge[] | Promise<Challenge[]>
        }
  }
}

export namespace ChallengeResolvers {
  export const defaultResolvers = {
    id: (parent: Challenge) => parent.id,
    score: (parent: Challenge) => parent.score,
    answered: (parent: Challenge) => parent.answered,
  }

  export type IdResolver =
    | ((
        parent: Challenge,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => string | Promise<string>)
    | {
        fragment: string
        resolve: (
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => string | Promise<string>
      }

  export type ScoreResolver =
    | ((
        parent: Challenge,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => number | Promise<number>)
    | {
        fragment: string
        resolve: (
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => number | Promise<number>
      }

  export type ChallengeSenderResolver =
    | ((
        parent: Challenge,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Player | null | Promise<Player | null>)
    | {
        fragment: string
        resolve: (
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Player | null | Promise<Player | null>
      }

  export type ChallengeReceiversResolver =
    | ((
        parent: Challenge,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Player[] | Promise<Player[]>)
    | {
        fragment: string
        resolve: (
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Player[] | Promise<Player[]>
      }

  export type AnsweredResolver =
    | ((
        parent: Challenge,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => boolean | Promise<boolean>)
    | {
        fragment: string
        resolve: (
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => boolean | Promise<boolean>
      }

  export interface Type {
    id:
      | ((
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => string | Promise<string>)
      | {
          fragment: string
          resolve: (
            parent: Challenge,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => string | Promise<string>
        }

    score:
      | ((
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => number | Promise<number>)
      | {
          fragment: string
          resolve: (
            parent: Challenge,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => number | Promise<number>
        }

    challengeSender:
      | ((
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Player | null | Promise<Player | null>)
      | {
          fragment: string
          resolve: (
            parent: Challenge,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Player | null | Promise<Player | null>
        }

    challengeReceivers:
      | ((
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Player[] | Promise<Player[]>)
      | {
          fragment: string
          resolve: (
            parent: Challenge,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Player[] | Promise<Player[]>
        }

    answered:
      | ((
          parent: Challenge,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => boolean | Promise<boolean>)
      | {
          fragment: string
          resolve: (
            parent: Challenge,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => boolean | Promise<boolean>
        }
  }
}

export namespace PlayerResolvers {
  export const defaultResolvers = {
    id: (parent: Player) => parent.id,
    FacebookID: (parent: Player) => parent.FacebookID,
    highScore: (parent: Player) =>
      parent.highScore === undefined ? null : parent.highScore,
  }

  export type IdResolver =
    | ((
        parent: Player,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => string | Promise<string>)
    | {
        fragment: string
        resolve: (
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => string | Promise<string>
      }

  export type FacebookIDResolver =
    | ((
        parent: Player,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => string | Promise<string>)
    | {
        fragment: string
        resolve: (
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => string | Promise<string>
      }

  export type HighScoreResolver =
    | ((
        parent: Player,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => number | null | Promise<number | null>)
    | {
        fragment: string
        resolve: (
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => number | null | Promise<number | null>
      }

  export type SentChallengesResolver =
    | ((
        parent: Player,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Challenge[] | Promise<Challenge[]>)
    | {
        fragment: string
        resolve: (
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge[] | Promise<Challenge[]>
      }

  export type PendingChallengesResolver =
    | ((
        parent: Player,
        args: {},
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Challenge[] | Promise<Challenge[]>)
    | {
        fragment: string
        resolve: (
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge[] | Promise<Challenge[]>
      }

  export interface Type {
    id:
      | ((
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => string | Promise<string>)
      | {
          fragment: string
          resolve: (
            parent: Player,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => string | Promise<string>
        }

    FacebookID:
      | ((
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => string | Promise<string>)
      | {
          fragment: string
          resolve: (
            parent: Player,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => string | Promise<string>
        }

    highScore:
      | ((
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => number | null | Promise<number | null>)
      | {
          fragment: string
          resolve: (
            parent: Player,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => number | null | Promise<number | null>
        }

    sentChallenges:
      | ((
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge[] | Promise<Challenge[]>)
      | {
          fragment: string
          resolve: (
            parent: Player,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Challenge[] | Promise<Challenge[]>
        }

    pendingChallenges:
      | ((
          parent: Player,
          args: {},
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge[] | Promise<Challenge[]>)
      | {
          fragment: string
          resolve: (
            parent: Player,
            args: {},
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Challenge[] | Promise<Challenge[]>
        }
  }
}

export namespace MutationResolvers {
  export const defaultResolvers = {}

  export interface ArgsSendChallenge {
    senderId: string
    receiverId: string
    score: number
    signature: string
  }

  export interface ArgsAnswerChallenge {
    challengeId: string
    score: number
    signature: string
  }

  export type SendChallengeResolver =
    | ((
        parent: undefined,
        args: ArgsSendChallenge,
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Challenge | Promise<Challenge>)
    | {
        fragment: string
        resolve: (
          parent: undefined,
          args: ArgsSendChallenge,
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge | Promise<Challenge>
      }

  export type AnswerChallengeResolver =
    | ((
        parent: undefined,
        args: ArgsAnswerChallenge,
        ctx: Context,
        info: GraphQLResolveInfo,
      ) => Challenge | Promise<Challenge>)
    | {
        fragment: string
        resolve: (
          parent: undefined,
          args: ArgsAnswerChallenge,
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge | Promise<Challenge>
      }

  export interface Type {
    sendChallenge:
      | ((
          parent: undefined,
          args: ArgsSendChallenge,
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge | Promise<Challenge>)
      | {
          fragment: string
          resolve: (
            parent: undefined,
            args: ArgsSendChallenge,
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Challenge | Promise<Challenge>
        }

    answerChallenge:
      | ((
          parent: undefined,
          args: ArgsAnswerChallenge,
          ctx: Context,
          info: GraphQLResolveInfo,
        ) => Challenge | Promise<Challenge>)
      | {
          fragment: string
          resolve: (
            parent: undefined,
            args: ArgsAnswerChallenge,
            ctx: Context,
            info: GraphQLResolveInfo,
          ) => Challenge | Promise<Challenge>
        }
  }
}

export interface Resolvers {
  Query: QueryResolvers.Type
  Challenge: ChallengeResolvers.Type
  Player: PlayerResolvers.Type
  Mutation: MutationResolvers.Type
}

// @ts-ignore
declare module 'graphql-tools' {
  interface IResolvers extends Resolvers {}
}
