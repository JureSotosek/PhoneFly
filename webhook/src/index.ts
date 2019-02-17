import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Prisma as Client } from './generated/client'
import router from './routes'

// Config validation

if (!process.env.PORT) {
  throw new Error(`Missing PORT environment variable.`)
}

if (!process.env.SERVER_ENDPOINT) {
  throw new Error(`Missing KUDOS_ENDPOINT environment variable.`)
}

// Server client

const client = new Client({
  endpoint: process.env.SERVER_ENDPOINT,
  debug: true,
})

// Webhook

const webhook = express()

// !! Verification

// Middleware

webhook.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

webhook.use(bodyParser.json())

webhook.use((req, _, next) => {
  req.client = client
  next()
})

// Router

webhook.use(router)

// Start

webhook.listen(process.env.PORT, err => {
  if (err) throw err
  console.log(`Webhook listening on: http://localhost:${process.env.PORT}`)
})
