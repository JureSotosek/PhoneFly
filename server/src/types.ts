import { Prisma } from './generated/prisma'

export interface Context {
  prisma: Prisma
  request: any
}

export interface Challenge {
  id: string
  score: number
  answered: boolean
}

export interface Player {
  id: string
  FacebookID: string
  highScore: number | null
}
