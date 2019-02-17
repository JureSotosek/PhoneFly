import * as got from 'got'
import { Command } from '../types'
import { errorResponse } from '../utils/responseBuilders'

const send: Command = (args, client, reqBody) => {
  const responseUrl = reqBody.response_url

  const regex = /<@(.*)\|(.*)>.?(.*)/g
  const parsedArgs = regex.exec(args)

  if (!parsedArgs) {
    return { text: 'You need to specify who to send kudos to 🙃' }
  }

  const recepientId = parsedArgs[1]
  const senderId = reqBody.user_id
  const channelId = reqBody.channel_id
  const workspaceId = reqBody.team_id

  const escapedRecepient = parsedArgs[0]

  if (senderId === recepientId) {
    return { text: "You can't send kudos to yourself 🤣" }
  }

  client.mutation
    .giveKudo({
      senderId,
      recepientId,
      channelId,
      workspaceId,
    })
    .then(() =>
      got.post(responseUrl, {
        body: JSON.stringify({
          text: `Kudos to ${escapedRecepient} sent successfully 🤘🏼`,
        }),
      }),
    )
    .catch(error =>
      got.post(responseUrl, {
        body: JSON.stringify(errorResponse),
      }),
    )

  return { text: 'Sending...' }
}

export default send
