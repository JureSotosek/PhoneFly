import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Options } from 'graphql-binding'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'

export interface Query {
    players: <T = Array<Player | null>>(args: { where?: PlayerWhereInput | null, orderBy?: PlayerOrderByInput | null, skip?: Int | null, after?: String | null, before?: String | null, first?: Int | null, last?: Int | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    challenges: <T = Array<Challenge | null>>(args: { where?: ChallengeWhereInput | null, orderBy?: ChallengeOrderByInput | null, skip?: Int | null, after?: String | null, before?: String | null, first?: Int | null, last?: Int | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    player: <T = Player | null>(args: { where: PlayerWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    challenge: <T = Challenge | null>(args: { where: ChallengeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    playersConnection: <T = PlayerConnection>(args: { where?: PlayerWhereInput | null, orderBy?: PlayerOrderByInput | null, skip?: Int | null, after?: String | null, before?: String | null, first?: Int | null, last?: Int | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    challengesConnection: <T = ChallengeConnection>(args: { where?: ChallengeWhereInput | null, orderBy?: ChallengeOrderByInput | null, skip?: Int | null, after?: String | null, before?: String | null, first?: Int | null, last?: Int | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    node: <T = Node | null>(args: { id: ID_Output }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> 
  }

export interface Mutation {
    createPlayer: <T = Player>(args: { data: PlayerCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createChallenge: <T = Challenge>(args: { data: ChallengeCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePlayer: <T = Player | null>(args: { data: PlayerUpdateInput, where: PlayerWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    updateChallenge: <T = Challenge | null>(args: { data: ChallengeUpdateInput, where: ChallengeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    deletePlayer: <T = Player | null>(args: { where: PlayerWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    deleteChallenge: <T = Challenge | null>(args: { where: ChallengeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    upsertPlayer: <T = Player>(args: { where: PlayerWhereUniqueInput, create: PlayerCreateInput, update: PlayerUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    upsertChallenge: <T = Challenge>(args: { where: ChallengeWhereUniqueInput, create: ChallengeCreateInput, update: ChallengeUpdateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyPlayers: <T = BatchPayload>(args: { data: PlayerUpdateManyMutationInput, where?: PlayerWhereInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateManyChallenges: <T = BatchPayload>(args: { data: ChallengeUpdateManyMutationInput, where?: ChallengeWhereInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyPlayers: <T = BatchPayload>(args: { where?: PlayerWhereInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteManyChallenges: <T = BatchPayload>(args: { where?: ChallengeWhereInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {
    player: <T = PlayerSubscriptionPayload | null>(args: { where?: PlayerSubscriptionWhereInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> ,
    challenge: <T = ChallengeSubscriptionPayload | null>(args: { where?: ChallengeSubscriptionWhereInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T | null>> 
  }

export interface Exists {
  Player: (where?: PlayerWhereInput) => Promise<boolean>
  Challenge: (where?: ChallengeWhereInput) => Promise<boolean>
}

export interface Prisma {
  query: Query
  mutation: Mutation
  subscription: Subscription
  exists: Exists
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
delegateSubscription(fieldName: string, args?: {
    [key: string]: any;
}, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(options: BasePrismaOptions): T
}
/**
 * Type Defs
*/

const typeDefs = `type AggregateChallenge {
  count: Int!
}

type AggregatePlayer {
  count: Int!
}

type BatchPayload {
  """The number of nodes that have been affected by the Batch operation."""
  count: Long!
}

type Challenge implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  score: Int!
  challengeSender: Player!
  challengeReceiver: Player!
  answered: Boolean!
}

"""A connection to a list of items."""
type ChallengeConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [ChallengeEdge]!
  aggregate: AggregateChallenge!
}

input ChallengeCreateInput {
  score: Int!
  answered: Boolean!
  challengeSender: PlayerCreateOneWithoutSentChallengesInput!
  challengeReceiver: PlayerCreateOneWithoutPendingChallengesInput!
}

input ChallengeCreateManyWithoutChallengeReceiverInput {
  create: [ChallengeCreateWithoutChallengeReceiverInput!]
  connect: [ChallengeWhereUniqueInput!]
}

input ChallengeCreateManyWithoutChallengeSenderInput {
  create: [ChallengeCreateWithoutChallengeSenderInput!]
  connect: [ChallengeWhereUniqueInput!]
}

input ChallengeCreateWithoutChallengeReceiverInput {
  score: Int!
  answered: Boolean!
  challengeSender: PlayerCreateOneWithoutSentChallengesInput!
}

input ChallengeCreateWithoutChallengeSenderInput {
  score: Int!
  answered: Boolean!
  challengeReceiver: PlayerCreateOneWithoutPendingChallengesInput!
}

"""An edge in a connection."""
type ChallengeEdge {
  """The item at the end of the edge."""
  node: Challenge!

  """A cursor for use in pagination."""
  cursor: String!
}

enum ChallengeOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  score_ASC
  score_DESC
  answered_ASC
  answered_DESC
}

type ChallengePreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  score: Int!
  answered: Boolean!
}

input ChallengeScalarWhereInput {
  """Logical AND on all given filters."""
  AND: [ChallengeScalarWhereInput!]

  """Logical OR on all given filters."""
  OR: [ChallengeScalarWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [ChallengeScalarWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  score: Int

  """All values that are not equal to given value."""
  score_not: Int

  """All values that are contained in given list."""
  score_in: [Int!]

  """All values that are not contained in given list."""
  score_not_in: [Int!]

  """All values less than the given value."""
  score_lt: Int

  """All values less than or equal the given value."""
  score_lte: Int

  """All values greater than the given value."""
  score_gt: Int

  """All values greater than or equal the given value."""
  score_gte: Int
  answered: Boolean

  """All values that are not equal to given value."""
  answered_not: Boolean
}

type ChallengeSubscriptionPayload {
  mutation: MutationType!
  node: Challenge
  updatedFields: [String!]
  previousValues: ChallengePreviousValues
}

input ChallengeSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [ChallengeSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [ChallengeSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [ChallengeSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: ChallengeWhereInput
}

input ChallengeUpdateInput {
  score: Int
  answered: Boolean
  challengeSender: PlayerUpdateOneRequiredWithoutSentChallengesInput
  challengeReceiver: PlayerUpdateOneRequiredWithoutPendingChallengesInput
}

input ChallengeUpdateManyDataInput {
  score: Int
  answered: Boolean
}

input ChallengeUpdateManyMutationInput {
  score: Int
  answered: Boolean
}

input ChallengeUpdateManyWithoutChallengeReceiverInput {
  create: [ChallengeCreateWithoutChallengeReceiverInput!]
  connect: [ChallengeWhereUniqueInput!]
  disconnect: [ChallengeWhereUniqueInput!]
  delete: [ChallengeWhereUniqueInput!]
  update: [ChallengeUpdateWithWhereUniqueWithoutChallengeReceiverInput!]
  updateMany: [ChallengeUpdateManyWithWhereNestedInput!]
  deleteMany: [ChallengeScalarWhereInput!]
  upsert: [ChallengeUpsertWithWhereUniqueWithoutChallengeReceiverInput!]
}

input ChallengeUpdateManyWithoutChallengeSenderInput {
  create: [ChallengeCreateWithoutChallengeSenderInput!]
  connect: [ChallengeWhereUniqueInput!]
  disconnect: [ChallengeWhereUniqueInput!]
  delete: [ChallengeWhereUniqueInput!]
  update: [ChallengeUpdateWithWhereUniqueWithoutChallengeSenderInput!]
  updateMany: [ChallengeUpdateManyWithWhereNestedInput!]
  deleteMany: [ChallengeScalarWhereInput!]
  upsert: [ChallengeUpsertWithWhereUniqueWithoutChallengeSenderInput!]
}

input ChallengeUpdateManyWithWhereNestedInput {
  where: ChallengeScalarWhereInput!
  data: ChallengeUpdateManyDataInput!
}

input ChallengeUpdateWithoutChallengeReceiverDataInput {
  score: Int
  answered: Boolean
  challengeSender: PlayerUpdateOneRequiredWithoutSentChallengesInput
}

input ChallengeUpdateWithoutChallengeSenderDataInput {
  score: Int
  answered: Boolean
  challengeReceiver: PlayerUpdateOneRequiredWithoutPendingChallengesInput
}

input ChallengeUpdateWithWhereUniqueWithoutChallengeReceiverInput {
  where: ChallengeWhereUniqueInput!
  data: ChallengeUpdateWithoutChallengeReceiverDataInput!
}

input ChallengeUpdateWithWhereUniqueWithoutChallengeSenderInput {
  where: ChallengeWhereUniqueInput!
  data: ChallengeUpdateWithoutChallengeSenderDataInput!
}

input ChallengeUpsertWithWhereUniqueWithoutChallengeReceiverInput {
  where: ChallengeWhereUniqueInput!
  update: ChallengeUpdateWithoutChallengeReceiverDataInput!
  create: ChallengeCreateWithoutChallengeReceiverInput!
}

input ChallengeUpsertWithWhereUniqueWithoutChallengeSenderInput {
  where: ChallengeWhereUniqueInput!
  update: ChallengeUpdateWithoutChallengeSenderDataInput!
  create: ChallengeCreateWithoutChallengeSenderInput!
}

input ChallengeWhereInput {
  """Logical AND on all given filters."""
  AND: [ChallengeWhereInput!]

  """Logical OR on all given filters."""
  OR: [ChallengeWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [ChallengeWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  score: Int

  """All values that are not equal to given value."""
  score_not: Int

  """All values that are contained in given list."""
  score_in: [Int!]

  """All values that are not contained in given list."""
  score_not_in: [Int!]

  """All values less than the given value."""
  score_lt: Int

  """All values less than or equal the given value."""
  score_lte: Int

  """All values greater than the given value."""
  score_gt: Int

  """All values greater than or equal the given value."""
  score_gte: Int
  answered: Boolean

  """All values that are not equal to given value."""
  answered_not: Boolean
  challengeSender: PlayerWhereInput
  challengeReceiver: PlayerWhereInput
}

input ChallengeWhereUniqueInput {
  id: ID
}

scalar DateTime

"""
The \`Long\` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
"""
scalar Long

type Mutation {
  createPlayer(data: PlayerCreateInput!): Player!
  createChallenge(data: ChallengeCreateInput!): Challenge!
  updatePlayer(data: PlayerUpdateInput!, where: PlayerWhereUniqueInput!): Player
  updateChallenge(data: ChallengeUpdateInput!, where: ChallengeWhereUniqueInput!): Challenge
  deletePlayer(where: PlayerWhereUniqueInput!): Player
  deleteChallenge(where: ChallengeWhereUniqueInput!): Challenge
  upsertPlayer(where: PlayerWhereUniqueInput!, create: PlayerCreateInput!, update: PlayerUpdateInput!): Player!
  upsertChallenge(where: ChallengeWhereUniqueInput!, create: ChallengeCreateInput!, update: ChallengeUpdateInput!): Challenge!
  updateManyPlayers(data: PlayerUpdateManyMutationInput!, where: PlayerWhereInput): BatchPayload!
  updateManyChallenges(data: ChallengeUpdateManyMutationInput!, where: ChallengeWhereInput): BatchPayload!
  deleteManyPlayers(where: PlayerWhereInput): BatchPayload!
  deleteManyChallenges(where: ChallengeWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

"""An object with an ID"""
interface Node {
  """The id of the object."""
  id: ID!
}

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: String

  """When paginating forwards, the cursor to continue."""
  endCursor: String
}

type Player implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  FacebookID: String!
  highScore: Float
  sentChallenges(where: ChallengeWhereInput, orderBy: ChallengeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Challenge!]
  pendingChallenges(where: ChallengeWhereInput, orderBy: ChallengeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Challenge!]
}

"""A connection to a list of items."""
type PlayerConnection {
  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """A list of edges."""
  edges: [PlayerEdge]!
  aggregate: AggregatePlayer!
}

input PlayerCreateInput {
  FacebookID: String!
  highScore: Float
  sentChallenges: ChallengeCreateManyWithoutChallengeSenderInput
  pendingChallenges: ChallengeCreateManyWithoutChallengeReceiverInput
}

input PlayerCreateOneWithoutPendingChallengesInput {
  create: PlayerCreateWithoutPendingChallengesInput
  connect: PlayerWhereUniqueInput
}

input PlayerCreateOneWithoutSentChallengesInput {
  create: PlayerCreateWithoutSentChallengesInput
  connect: PlayerWhereUniqueInput
}

input PlayerCreateWithoutPendingChallengesInput {
  FacebookID: String!
  highScore: Float
  sentChallenges: ChallengeCreateManyWithoutChallengeSenderInput
}

input PlayerCreateWithoutSentChallengesInput {
  FacebookID: String!
  highScore: Float
  pendingChallenges: ChallengeCreateManyWithoutChallengeReceiverInput
}

"""An edge in a connection."""
type PlayerEdge {
  """The item at the end of the edge."""
  node: Player!

  """A cursor for use in pagination."""
  cursor: String!
}

enum PlayerOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  FacebookID_ASC
  FacebookID_DESC
  highScore_ASC
  highScore_DESC
}

type PlayerPreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  FacebookID: String!
  highScore: Float
}

type PlayerSubscriptionPayload {
  mutation: MutationType!
  node: Player
  updatedFields: [String!]
  previousValues: PlayerPreviousValues
}

input PlayerSubscriptionWhereInput {
  """Logical AND on all given filters."""
  AND: [PlayerSubscriptionWhereInput!]

  """Logical OR on all given filters."""
  OR: [PlayerSubscriptionWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [PlayerSubscriptionWhereInput!]

  """
  The subscription event gets dispatched when it's listed in mutation_in
  """
  mutation_in: [MutationType!]

  """
  The subscription event gets only dispatched when one of the updated fields names is included in this list
  """
  updatedFields_contains: String

  """
  The subscription event gets only dispatched when all of the field names included in this list have been updated
  """
  updatedFields_contains_every: [String!]

  """
  The subscription event gets only dispatched when some of the field names included in this list have been updated
  """
  updatedFields_contains_some: [String!]
  node: PlayerWhereInput
}

input PlayerUpdateInput {
  FacebookID: String
  highScore: Float
  sentChallenges: ChallengeUpdateManyWithoutChallengeSenderInput
  pendingChallenges: ChallengeUpdateManyWithoutChallengeReceiverInput
}

input PlayerUpdateManyMutationInput {
  FacebookID: String
  highScore: Float
}

input PlayerUpdateOneRequiredWithoutPendingChallengesInput {
  create: PlayerCreateWithoutPendingChallengesInput
  connect: PlayerWhereUniqueInput
  update: PlayerUpdateWithoutPendingChallengesDataInput
  upsert: PlayerUpsertWithoutPendingChallengesInput
}

input PlayerUpdateOneRequiredWithoutSentChallengesInput {
  create: PlayerCreateWithoutSentChallengesInput
  connect: PlayerWhereUniqueInput
  update: PlayerUpdateWithoutSentChallengesDataInput
  upsert: PlayerUpsertWithoutSentChallengesInput
}

input PlayerUpdateWithoutPendingChallengesDataInput {
  FacebookID: String
  highScore: Float
  sentChallenges: ChallengeUpdateManyWithoutChallengeSenderInput
}

input PlayerUpdateWithoutSentChallengesDataInput {
  FacebookID: String
  highScore: Float
  pendingChallenges: ChallengeUpdateManyWithoutChallengeReceiverInput
}

input PlayerUpsertWithoutPendingChallengesInput {
  update: PlayerUpdateWithoutPendingChallengesDataInput!
  create: PlayerCreateWithoutPendingChallengesInput!
}

input PlayerUpsertWithoutSentChallengesInput {
  update: PlayerUpdateWithoutSentChallengesDataInput!
  create: PlayerCreateWithoutSentChallengesInput!
}

input PlayerWhereInput {
  """Logical AND on all given filters."""
  AND: [PlayerWhereInput!]

  """Logical OR on all given filters."""
  OR: [PlayerWhereInput!]

  """Logical NOT on all given filters combined by AND."""
  NOT: [PlayerWhereInput!]
  id: ID

  """All values that are not equal to given value."""
  id_not: ID

  """All values that are contained in given list."""
  id_in: [ID!]

  """All values that are not contained in given list."""
  id_not_in: [ID!]

  """All values less than the given value."""
  id_lt: ID

  """All values less than or equal the given value."""
  id_lte: ID

  """All values greater than the given value."""
  id_gt: ID

  """All values greater than or equal the given value."""
  id_gte: ID

  """All values containing the given string."""
  id_contains: ID

  """All values not containing the given string."""
  id_not_contains: ID

  """All values starting with the given string."""
  id_starts_with: ID

  """All values not starting with the given string."""
  id_not_starts_with: ID

  """All values ending with the given string."""
  id_ends_with: ID

  """All values not ending with the given string."""
  id_not_ends_with: ID
  createdAt: DateTime

  """All values that are not equal to given value."""
  createdAt_not: DateTime

  """All values that are contained in given list."""
  createdAt_in: [DateTime!]

  """All values that are not contained in given list."""
  createdAt_not_in: [DateTime!]

  """All values less than the given value."""
  createdAt_lt: DateTime

  """All values less than or equal the given value."""
  createdAt_lte: DateTime

  """All values greater than the given value."""
  createdAt_gt: DateTime

  """All values greater than or equal the given value."""
  createdAt_gte: DateTime
  updatedAt: DateTime

  """All values that are not equal to given value."""
  updatedAt_not: DateTime

  """All values that are contained in given list."""
  updatedAt_in: [DateTime!]

  """All values that are not contained in given list."""
  updatedAt_not_in: [DateTime!]

  """All values less than the given value."""
  updatedAt_lt: DateTime

  """All values less than or equal the given value."""
  updatedAt_lte: DateTime

  """All values greater than the given value."""
  updatedAt_gt: DateTime

  """All values greater than or equal the given value."""
  updatedAt_gte: DateTime
  FacebookID: String

  """All values that are not equal to given value."""
  FacebookID_not: String

  """All values that are contained in given list."""
  FacebookID_in: [String!]

  """All values that are not contained in given list."""
  FacebookID_not_in: [String!]

  """All values less than the given value."""
  FacebookID_lt: String

  """All values less than or equal the given value."""
  FacebookID_lte: String

  """All values greater than the given value."""
  FacebookID_gt: String

  """All values greater than or equal the given value."""
  FacebookID_gte: String

  """All values containing the given string."""
  FacebookID_contains: String

  """All values not containing the given string."""
  FacebookID_not_contains: String

  """All values starting with the given string."""
  FacebookID_starts_with: String

  """All values not starting with the given string."""
  FacebookID_not_starts_with: String

  """All values ending with the given string."""
  FacebookID_ends_with: String

  """All values not ending with the given string."""
  FacebookID_not_ends_with: String
  highScore: Float

  """All values that are not equal to given value."""
  highScore_not: Float

  """All values that are contained in given list."""
  highScore_in: [Float!]

  """All values that are not contained in given list."""
  highScore_not_in: [Float!]

  """All values less than the given value."""
  highScore_lt: Float

  """All values less than or equal the given value."""
  highScore_lte: Float

  """All values greater than the given value."""
  highScore_gt: Float

  """All values greater than or equal the given value."""
  highScore_gte: Float
  sentChallenges_every: ChallengeWhereInput
  sentChallenges_some: ChallengeWhereInput
  sentChallenges_none: ChallengeWhereInput
  pendingChallenges_every: ChallengeWhereInput
  pendingChallenges_some: ChallengeWhereInput
  pendingChallenges_none: ChallengeWhereInput
}

input PlayerWhereUniqueInput {
  id: ID
  FacebookID: String
}

type Query {
  players(where: PlayerWhereInput, orderBy: PlayerOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Player]!
  challenges(where: ChallengeWhereInput, orderBy: ChallengeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Challenge]!
  player(where: PlayerWhereUniqueInput!): Player
  challenge(where: ChallengeWhereUniqueInput!): Challenge
  playersConnection(where: PlayerWhereInput, orderBy: PlayerOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PlayerConnection!
  challengesConnection(where: ChallengeWhereInput, orderBy: ChallengeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ChallengeConnection!

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
}

type Subscription {
  player(where: PlayerSubscriptionWhereInput): PlayerSubscriptionPayload
  challenge(where: ChallengeSubscriptionWhereInput): ChallengeSubscriptionPayload
}
`

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({typeDefs})

/**
 * Types
*/

export type ChallengeOrderByInput =   'id_ASC' |
  'id_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'score_ASC' |
  'score_DESC' |
  'answered_ASC' |
  'answered_DESC'

export type MutationType =   'CREATED' |
  'UPDATED' |
  'DELETED'

export type PlayerOrderByInput =   'id_ASC' |
  'id_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'FacebookID_ASC' |
  'FacebookID_DESC' |
  'highScore_ASC' |
  'highScore_DESC'

export interface ChallengeCreateInput {
  score: Int
  answered: Boolean
  challengeSender: PlayerCreateOneWithoutSentChallengesInput
  challengeReceiver: PlayerCreateOneWithoutPendingChallengesInput
}

export interface ChallengeCreateManyWithoutChallengeReceiverInput {
  create?: ChallengeCreateWithoutChallengeReceiverInput[] | ChallengeCreateWithoutChallengeReceiverInput | null
  connect?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
}

export interface ChallengeCreateManyWithoutChallengeSenderInput {
  create?: ChallengeCreateWithoutChallengeSenderInput[] | ChallengeCreateWithoutChallengeSenderInput | null
  connect?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
}

export interface ChallengeCreateWithoutChallengeReceiverInput {
  score: Int
  answered: Boolean
  challengeSender: PlayerCreateOneWithoutSentChallengesInput
}

export interface ChallengeCreateWithoutChallengeSenderInput {
  score: Int
  answered: Boolean
  challengeReceiver: PlayerCreateOneWithoutPendingChallengesInput
}

export interface ChallengeScalarWhereInput {
  AND?: ChallengeScalarWhereInput[] | ChallengeScalarWhereInput | null
  OR?: ChallengeScalarWhereInput[] | ChallengeScalarWhereInput | null
  NOT?: ChallengeScalarWhereInput[] | ChallengeScalarWhereInput | null
  id?: ID_Input | null
  id_not?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  id_not_in?: ID_Output[] | ID_Output | null
  id_lt?: ID_Input | null
  id_lte?: ID_Input | null
  id_gt?: ID_Input | null
  id_gte?: ID_Input | null
  id_contains?: ID_Input | null
  id_not_contains?: ID_Input | null
  id_starts_with?: ID_Input | null
  id_not_starts_with?: ID_Input | null
  id_ends_with?: ID_Input | null
  id_not_ends_with?: ID_Input | null
  createdAt?: DateTime | null
  createdAt_not?: DateTime | null
  createdAt_in?: DateTime[] | DateTime | null
  createdAt_not_in?: DateTime[] | DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  updatedAt?: DateTime | null
  updatedAt_not?: DateTime | null
  updatedAt_in?: DateTime[] | DateTime | null
  updatedAt_not_in?: DateTime[] | DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  score?: Int | null
  score_not?: Int | null
  score_in?: Int[] | Int | null
  score_not_in?: Int[] | Int | null
  score_lt?: Int | null
  score_lte?: Int | null
  score_gt?: Int | null
  score_gte?: Int | null
  answered?: Boolean | null
  answered_not?: Boolean | null
}

export interface ChallengeSubscriptionWhereInput {
  AND?: ChallengeSubscriptionWhereInput[] | ChallengeSubscriptionWhereInput | null
  OR?: ChallengeSubscriptionWhereInput[] | ChallengeSubscriptionWhereInput | null
  NOT?: ChallengeSubscriptionWhereInput[] | ChallengeSubscriptionWhereInput | null
  mutation_in?: MutationType[] | MutationType | null
  updatedFields_contains?: String | null
  updatedFields_contains_every?: String[] | String | null
  updatedFields_contains_some?: String[] | String | null
  node?: ChallengeWhereInput | null
}

export interface ChallengeUpdateInput {
  score?: Int | null
  answered?: Boolean | null
  challengeSender?: PlayerUpdateOneRequiredWithoutSentChallengesInput | null
  challengeReceiver?: PlayerUpdateOneRequiredWithoutPendingChallengesInput | null
}

export interface ChallengeUpdateManyDataInput {
  score?: Int | null
  answered?: Boolean | null
}

export interface ChallengeUpdateManyMutationInput {
  score?: Int | null
  answered?: Boolean | null
}

export interface ChallengeUpdateManyWithoutChallengeReceiverInput {
  create?: ChallengeCreateWithoutChallengeReceiverInput[] | ChallengeCreateWithoutChallengeReceiverInput | null
  connect?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
  disconnect?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
  delete?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
  update?: ChallengeUpdateWithWhereUniqueWithoutChallengeReceiverInput[] | ChallengeUpdateWithWhereUniqueWithoutChallengeReceiverInput | null
  updateMany?: ChallengeUpdateManyWithWhereNestedInput[] | ChallengeUpdateManyWithWhereNestedInput | null
  deleteMany?: ChallengeScalarWhereInput[] | ChallengeScalarWhereInput | null
  upsert?: ChallengeUpsertWithWhereUniqueWithoutChallengeReceiverInput[] | ChallengeUpsertWithWhereUniqueWithoutChallengeReceiverInput | null
}

export interface ChallengeUpdateManyWithoutChallengeSenderInput {
  create?: ChallengeCreateWithoutChallengeSenderInput[] | ChallengeCreateWithoutChallengeSenderInput | null
  connect?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
  disconnect?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
  delete?: ChallengeWhereUniqueInput[] | ChallengeWhereUniqueInput | null
  update?: ChallengeUpdateWithWhereUniqueWithoutChallengeSenderInput[] | ChallengeUpdateWithWhereUniqueWithoutChallengeSenderInput | null
  updateMany?: ChallengeUpdateManyWithWhereNestedInput[] | ChallengeUpdateManyWithWhereNestedInput | null
  deleteMany?: ChallengeScalarWhereInput[] | ChallengeScalarWhereInput | null
  upsert?: ChallengeUpsertWithWhereUniqueWithoutChallengeSenderInput[] | ChallengeUpsertWithWhereUniqueWithoutChallengeSenderInput | null
}

export interface ChallengeUpdateManyWithWhereNestedInput {
  where: ChallengeScalarWhereInput
  data: ChallengeUpdateManyDataInput
}

export interface ChallengeUpdateWithoutChallengeReceiverDataInput {
  score?: Int | null
  answered?: Boolean | null
  challengeSender?: PlayerUpdateOneRequiredWithoutSentChallengesInput | null
}

export interface ChallengeUpdateWithoutChallengeSenderDataInput {
  score?: Int | null
  answered?: Boolean | null
  challengeReceiver?: PlayerUpdateOneRequiredWithoutPendingChallengesInput | null
}

export interface ChallengeUpdateWithWhereUniqueWithoutChallengeReceiverInput {
  where: ChallengeWhereUniqueInput
  data: ChallengeUpdateWithoutChallengeReceiverDataInput
}

export interface ChallengeUpdateWithWhereUniqueWithoutChallengeSenderInput {
  where: ChallengeWhereUniqueInput
  data: ChallengeUpdateWithoutChallengeSenderDataInput
}

export interface ChallengeUpsertWithWhereUniqueWithoutChallengeReceiverInput {
  where: ChallengeWhereUniqueInput
  update: ChallengeUpdateWithoutChallengeReceiverDataInput
  create: ChallengeCreateWithoutChallengeReceiverInput
}

export interface ChallengeUpsertWithWhereUniqueWithoutChallengeSenderInput {
  where: ChallengeWhereUniqueInput
  update: ChallengeUpdateWithoutChallengeSenderDataInput
  create: ChallengeCreateWithoutChallengeSenderInput
}

export interface ChallengeWhereInput {
  AND?: ChallengeWhereInput[] | ChallengeWhereInput | null
  OR?: ChallengeWhereInput[] | ChallengeWhereInput | null
  NOT?: ChallengeWhereInput[] | ChallengeWhereInput | null
  id?: ID_Input | null
  id_not?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  id_not_in?: ID_Output[] | ID_Output | null
  id_lt?: ID_Input | null
  id_lte?: ID_Input | null
  id_gt?: ID_Input | null
  id_gte?: ID_Input | null
  id_contains?: ID_Input | null
  id_not_contains?: ID_Input | null
  id_starts_with?: ID_Input | null
  id_not_starts_with?: ID_Input | null
  id_ends_with?: ID_Input | null
  id_not_ends_with?: ID_Input | null
  createdAt?: DateTime | null
  createdAt_not?: DateTime | null
  createdAt_in?: DateTime[] | DateTime | null
  createdAt_not_in?: DateTime[] | DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  updatedAt?: DateTime | null
  updatedAt_not?: DateTime | null
  updatedAt_in?: DateTime[] | DateTime | null
  updatedAt_not_in?: DateTime[] | DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  score?: Int | null
  score_not?: Int | null
  score_in?: Int[] | Int | null
  score_not_in?: Int[] | Int | null
  score_lt?: Int | null
  score_lte?: Int | null
  score_gt?: Int | null
  score_gte?: Int | null
  answered?: Boolean | null
  answered_not?: Boolean | null
  challengeSender?: PlayerWhereInput | null
  challengeReceiver?: PlayerWhereInput | null
}

export interface ChallengeWhereUniqueInput {
  id?: ID_Input | null
}

export interface PlayerCreateInput {
  FacebookID: String
  highScore?: Float | null
  sentChallenges?: ChallengeCreateManyWithoutChallengeSenderInput | null
  pendingChallenges?: ChallengeCreateManyWithoutChallengeReceiverInput | null
}

export interface PlayerCreateOneWithoutPendingChallengesInput {
  create?: PlayerCreateWithoutPendingChallengesInput | null
  connect?: PlayerWhereUniqueInput | null
}

export interface PlayerCreateOneWithoutSentChallengesInput {
  create?: PlayerCreateWithoutSentChallengesInput | null
  connect?: PlayerWhereUniqueInput | null
}

export interface PlayerCreateWithoutPendingChallengesInput {
  FacebookID: String
  highScore?: Float | null
  sentChallenges?: ChallengeCreateManyWithoutChallengeSenderInput | null
}

export interface PlayerCreateWithoutSentChallengesInput {
  FacebookID: String
  highScore?: Float | null
  pendingChallenges?: ChallengeCreateManyWithoutChallengeReceiverInput | null
}

export interface PlayerSubscriptionWhereInput {
  AND?: PlayerSubscriptionWhereInput[] | PlayerSubscriptionWhereInput | null
  OR?: PlayerSubscriptionWhereInput[] | PlayerSubscriptionWhereInput | null
  NOT?: PlayerSubscriptionWhereInput[] | PlayerSubscriptionWhereInput | null
  mutation_in?: MutationType[] | MutationType | null
  updatedFields_contains?: String | null
  updatedFields_contains_every?: String[] | String | null
  updatedFields_contains_some?: String[] | String | null
  node?: PlayerWhereInput | null
}

export interface PlayerUpdateInput {
  FacebookID?: String | null
  highScore?: Float | null
  sentChallenges?: ChallengeUpdateManyWithoutChallengeSenderInput | null
  pendingChallenges?: ChallengeUpdateManyWithoutChallengeReceiverInput | null
}

export interface PlayerUpdateManyMutationInput {
  FacebookID?: String | null
  highScore?: Float | null
}

export interface PlayerUpdateOneRequiredWithoutPendingChallengesInput {
  create?: PlayerCreateWithoutPendingChallengesInput | null
  connect?: PlayerWhereUniqueInput | null
  update?: PlayerUpdateWithoutPendingChallengesDataInput | null
  upsert?: PlayerUpsertWithoutPendingChallengesInput | null
}

export interface PlayerUpdateOneRequiredWithoutSentChallengesInput {
  create?: PlayerCreateWithoutSentChallengesInput | null
  connect?: PlayerWhereUniqueInput | null
  update?: PlayerUpdateWithoutSentChallengesDataInput | null
  upsert?: PlayerUpsertWithoutSentChallengesInput | null
}

export interface PlayerUpdateWithoutPendingChallengesDataInput {
  FacebookID?: String | null
  highScore?: Float | null
  sentChallenges?: ChallengeUpdateManyWithoutChallengeSenderInput | null
}

export interface PlayerUpdateWithoutSentChallengesDataInput {
  FacebookID?: String | null
  highScore?: Float | null
  pendingChallenges?: ChallengeUpdateManyWithoutChallengeReceiverInput | null
}

export interface PlayerUpsertWithoutPendingChallengesInput {
  update: PlayerUpdateWithoutPendingChallengesDataInput
  create: PlayerCreateWithoutPendingChallengesInput
}

export interface PlayerUpsertWithoutSentChallengesInput {
  update: PlayerUpdateWithoutSentChallengesDataInput
  create: PlayerCreateWithoutSentChallengesInput
}

export interface PlayerWhereInput {
  AND?: PlayerWhereInput[] | PlayerWhereInput | null
  OR?: PlayerWhereInput[] | PlayerWhereInput | null
  NOT?: PlayerWhereInput[] | PlayerWhereInput | null
  id?: ID_Input | null
  id_not?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  id_not_in?: ID_Output[] | ID_Output | null
  id_lt?: ID_Input | null
  id_lte?: ID_Input | null
  id_gt?: ID_Input | null
  id_gte?: ID_Input | null
  id_contains?: ID_Input | null
  id_not_contains?: ID_Input | null
  id_starts_with?: ID_Input | null
  id_not_starts_with?: ID_Input | null
  id_ends_with?: ID_Input | null
  id_not_ends_with?: ID_Input | null
  createdAt?: DateTime | null
  createdAt_not?: DateTime | null
  createdAt_in?: DateTime[] | DateTime | null
  createdAt_not_in?: DateTime[] | DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  updatedAt?: DateTime | null
  updatedAt_not?: DateTime | null
  updatedAt_in?: DateTime[] | DateTime | null
  updatedAt_not_in?: DateTime[] | DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  FacebookID?: String | null
  FacebookID_not?: String | null
  FacebookID_in?: String[] | String | null
  FacebookID_not_in?: String[] | String | null
  FacebookID_lt?: String | null
  FacebookID_lte?: String | null
  FacebookID_gt?: String | null
  FacebookID_gte?: String | null
  FacebookID_contains?: String | null
  FacebookID_not_contains?: String | null
  FacebookID_starts_with?: String | null
  FacebookID_not_starts_with?: String | null
  FacebookID_ends_with?: String | null
  FacebookID_not_ends_with?: String | null
  highScore?: Float | null
  highScore_not?: Float | null
  highScore_in?: Float[] | Float | null
  highScore_not_in?: Float[] | Float | null
  highScore_lt?: Float | null
  highScore_lte?: Float | null
  highScore_gt?: Float | null
  highScore_gte?: Float | null
  sentChallenges_every?: ChallengeWhereInput | null
  sentChallenges_some?: ChallengeWhereInput | null
  sentChallenges_none?: ChallengeWhereInput | null
  pendingChallenges_every?: ChallengeWhereInput | null
  pendingChallenges_some?: ChallengeWhereInput | null
  pendingChallenges_none?: ChallengeWhereInput | null
}

export interface PlayerWhereUniqueInput {
  id?: ID_Input | null
  FacebookID?: String | null
}

/*
 * An object with an ID

 */
export interface Node {
  id: ID_Output
}

export interface AggregateChallenge {
  count: Int
}

export interface AggregatePlayer {
  count: Int
}

export interface BatchPayload {
  count: Long
}

export interface Challenge extends Node {
  id: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  score: Int
  challengeSender: Player
  challengeReceiver: Player
  answered: Boolean
}

/*
 * A connection to a list of items.

 */
export interface ChallengeConnection {
  pageInfo: PageInfo
  edges: Array<ChallengeEdge | null>
  aggregate: AggregateChallenge
}

/*
 * An edge in a connection.

 */
export interface ChallengeEdge {
  node: Challenge
  cursor: String
}

export interface ChallengePreviousValues {
  id: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  score: Int
  answered: Boolean
}

export interface ChallengeSubscriptionPayload {
  mutation: MutationType
  node?: Challenge | null
  updatedFields?: Array<String> | null
  previousValues?: ChallengePreviousValues | null
}

/*
 * Information about pagination in a connection.

 */
export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface Player extends Node {
  id: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  FacebookID: String
  highScore?: Float | null
  sentChallenges?: Array<Challenge> | null
  pendingChallenges?: Array<Challenge> | null
}

/*
 * A connection to a list of items.

 */
export interface PlayerConnection {
  pageInfo: PageInfo
  edges: Array<PlayerEdge | null>
  aggregate: AggregatePlayer
}

/*
 * An edge in a connection.

 */
export interface PlayerEdge {
  node: Player
  cursor: String
}

export interface PlayerPreviousValues {
  id: ID_Output
  createdAt: DateTime
  updatedAt: DateTime
  FacebookID: String
  highScore?: Float | null
}

export interface PlayerSubscriptionPayload {
  mutation: MutationType
  node?: Player | null
  updatedFields?: Array<String> | null
  previousValues?: PlayerPreviousValues | null
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). 
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
The `Long` scalar type represents non-fractional signed whole numeric values.
Long can represent values between -(2^63) and 2^63 - 1.
*/
export type Long = string

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string