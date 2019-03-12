import { Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'

export interface Query {
  pendingChallenges: <T = Array<Challenge>>(
    args: { playerId: String; signature: String },
    info?: GraphQLResolveInfo | string,
    options?: Options,
  ) => Promise<T>
}

export interface Mutation {
  sendChallenge: <T = Challenge>(
    args: {
      senderId: String
      receiverId: String
      score: Float
      signature: String
    },
    info?: GraphQLResolveInfo | string,
    options?: Options,
  ) => Promise<T>
  answerChallenge: <T = Challenge>(
    args: { challengeId: String; score: Float; signature: String },
    info?: GraphQLResolveInfo | string,
    options?: Options,
  ) => Promise<T>
}

export interface Subscription {}

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(
    query: string,
    variables?: { [key: string]: any },
  ) => Promise<T>
  delegate(
    operation: 'query' | 'mutation',
    fieldName: string,
    args: {
      [key: string]: any
    },
    infoOrQuery?: GraphQLResolveInfo | string,
    options?: Options,
  ): Promise<any>
  delegateSubscription(
    fieldName: string,
    args?: {
      [key: string]: any
    },
    infoOrQuery?: GraphQLResolveInfo | string,
    options?: Options,
  ): Promise<AsyncIterator<any>>
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers
}

export interface BindingConstructor<T> {
  new (...args: any[]): T
}

/**
 * Types
 */

export interface Challenge {
  id: ID_Output
  score: Float
  challengeSender?: Player | null
  challengeReceivers: Array<Player>
  answered: Boolean
}

export interface Player {
  id: ID_Output
  FacebookID: String
  highScore?: Float | null
  sentChallenges: Array<Challenge>
  pendingChallenges: Array<Challenge>
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). 
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string
