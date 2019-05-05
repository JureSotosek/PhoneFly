import { IResolvers } from 'graphql-tools'
import { Query } from './Query'
import { Mutation } from './Mutation'

export const resolvers = {
  Query,
  Mutation,
} as IResolvers
