import { Router } from 'express'
import commands from './commands'
import interactions from './interactions'

const router = Router()

router.post('/commands', async (req, res) => {
  const [command, commandArguments] = req.body.text.split(' ', 2)

  if (!command) {
    res.send({ text: `No command specified. Try /kudos help!` })
  }

  if (!commands.hasOwnProperty(command)) {
    res.send({ text: `Couldn't find command "${command}". Try /kudos help!` })
  }

  res.send(await commands[command](commandArguments, req.client, req.body))
})

router.post('/interactions', async (req, res) => {
  const parsedReqBody = JSON.parse(req.body.payload)

  res.send(
    await interactions[parsedReqBody.callback_id](req.client, parsedReqBody),
  )
})

export default router
