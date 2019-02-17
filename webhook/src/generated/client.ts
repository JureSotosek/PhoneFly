import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { Options } from 'graphql-binding'
import { makePrismaBindingClass, BasePrismaOptions } from 'prisma-binding'

export interface Query {
    kudo: <T = Kudo | null>(args: { id: ID_Output }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    leaderboard: <T = LeaderboardPayload | null>(args: { channelId: String }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    channelStats: <T = ChannelStatsPayload | null>(args: { channelId: String, timePeriod: TimePeriod }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    memberStats: <T = MemberStatsPayload | null>(args: { memberId: String, timePeriod: TimePeriod }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    giveKudo: <T = Kudo>(args: { senderId: String, recepientId: String, channelId: String, workspaceId: String }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    startCompetition: <T = Boolean>(args: { channelId: String, memberId: String, workspaceId: String, timePeriod: TimePeriod }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    toggleEngagement: <T = Boolean>(args: { channelId: String, memberId: String, workspaceId?: String }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {}

export interface Exists {

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

const typeDefs = `type Channel {
  id: ID!
  slackId: String!
  workspace: Workspace!
  competition: CompetitionConfig
  engagement: EngagementConfig
  kudos: [Kudo!]!
}

type ChannelStatsPayload {
  kudosExchanged: Int!
  mostKudosReceivedBy: [MemberWithCount!]!
  mostKudosSentBy: [MemberWithCount!]!
  timePeriod: TimePeriod!
}

type CompetitionConfig {
  id: ID!
  channel: Channel!
  startedAt: String!
  endsAt: String!
  timePeriod: TimePeriod!
}

type EngagementConfig {
  id: ID!
  channel: Channel!
  timePeriod: TimePeriod!
}

type Kudo {
  id: ID!
  workspace: Workspace!
  channel: Channel!
  sentBy: Member!
  receivedBy: Member!
}

type LeaderboardPayload {
  mostKudosReceivedBy: [MemberWithCount!]!
  mostKudosSentBy: [MemberWithCount!]!
  competitionConfig: CompetitionConfig!
}

type Member {
  id: ID!
  slackId: String!
  workspace: Workspace!
  kudosSent: [Kudo!]!
  kudosReceived: [Kudo!]!
}

type MemberStatsPayload {
  kudosExchanged: Int!
  kudosSent: Int!
  kudosReceived: Int!
  mostKudosReceivedFrom: [MemberWithCount!]!
  mostKudosSentTo: [MemberWithCount!]!
  timePeriod: TimePeriod!
}

type MemberWithCount {
  member: Member!
  count: Int!
}

type Mutation {
  giveKudo(senderId: String!, recepientId: String!, channelId: String!, workspaceId: String!): Kudo!
  startCompetition(channelId: String!, memberId: String!, workspaceId: String!, timePeriod: TimePeriod!): Boolean!
  toggleEngagement(channelId: String!, memberId: String!, workspaceId: String): Boolean!
}

type Query {
  kudo(id: ID!): Kudo
  leaderboard(channelId: String!): LeaderboardPayload
  channelStats(channelId: String!, timePeriod: TimePeriod!): ChannelStatsPayload
  memberStats(memberId: String!, timePeriod: TimePeriod!): MemberStatsPayload
}

enum TimePeriod {
  DAY
  WEEK
  MONTH
  HALF_YEAR
  YEAR
  ALL_TIME
}

type Workspace {
  id: ID!
  slackId: String!
  channels: [Channel!]!
  members: [Member!]!
  kudos: [Kudo!]!
}
`

export const Prisma = makePrismaBindingClass<BindingConstructor<Prisma>>({typeDefs})

/**
 * Types
*/

export type TimePeriod =   'DAY' |
  'WEEK' |
  'MONTH' |
  'HALF_YEAR' |
  'YEAR' |
  'ALL_TIME'

export interface ChannelStatsPayload {
  kudosExchanged: Int
  mostKudosReceivedBy: MemberWithCount[]
  mostKudosSentBy: MemberWithCount[]
  timePeriod: TimePeriod
}

export interface EngagementConfig {
  id: ID_Output
  channel: Channel
  timePeriod: TimePeriod
}

export interface MemberWithCount {
  member: Member
  count: Int
}

export interface LeaderboardPayload {
  mostKudosReceivedBy: MemberWithCount[]
  mostKudosSentBy: MemberWithCount[]
  competitionConfig: CompetitionConfig
}

export interface Member {
  id: ID_Output
  slackId: String
  workspace: Workspace
  kudosSent: Kudo[]
  kudosReceived: Kudo[]
}

export interface Kudo {
  id: ID_Output
  workspace: Workspace
  channel: Channel
  sentBy: Member
  receivedBy: Member
}

export interface Workspace {
  id: ID_Output
  slackId: String
  channels: Channel[]
  members: Member[]
  kudos: Kudo[]
}

export interface CompetitionConfig {
  id: ID_Output
  channel: Channel
  startedAt: String
  endsAt: String
  timePeriod: TimePeriod
}

export interface Channel {
  id: ID_Output
  slackId: String
  workspace: Workspace
  competition?: CompetitionConfig
  engagement?: EngagementConfig
  kudos: Kudo[]
}

export interface MemberStatsPayload {
  kudosExchanged: Int
  kudosSent: Int
  kudosReceived: Int
  mostKudosReceivedFrom: MemberWithCount[]
  mostKudosSentTo: MemberWithCount[]
  timePeriod: TimePeriod
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number