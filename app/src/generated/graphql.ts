export type Maybe<T> = T | null

// ====================================================
// Types
// ====================================================

export interface Query {
  pendingChallenges: Challenge[]
}

export interface Challenge {
  id: string

  score: number

  challengeSender?: Maybe<Player>

  challengeReceivers: Player[]

  answered: boolean
}

export interface Player {
  id: string

  FacebookID: string

  highScore?: Maybe<number>

  sentChallenges: Challenge[]

  pendingChallenges: Challenge[]
}

export interface Mutation {
  sendChallenge: Challenge

  answerChallenge: Challenge
}

// ====================================================
// Arguments
// ====================================================

export interface PendingChallengesQueryArgs {
  signature: string
}
export interface SendChallengeMutationArgs {
  receiverId: string

  score: number

  signature: string
}
export interface AnswerChallengeMutationArgs {
  challengeId: string

  score: number

  signature: string
}
