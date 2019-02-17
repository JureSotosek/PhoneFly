import * as got from 'got'
import { Command } from '../types'
import { memberStatsQuery, channelStatsQuery } from '../utils/queries'
import {
  errorResponse,
  memberStatsResponse,
  channelStatsResponse,
} from '../utils/responseBuilders'

const stats: Command = (args, client, reqBody) => {
  const responseUrl = reqBody.response_url

  const memberRegex = /<@(.*)\|(.*)>.?(.*)/g
  const memberParsedArgs = memberRegex.exec(args)

  const channelRegex = /<#(.*)\|(.*)>.?(.*)/g
  const channelParsedArgs = channelRegex.exec(args)

  if (memberParsedArgs) {
    const memberId = memberParsedArgs[1]

    client.query
      .memberStats({ memberId, timePeriod: 'WEEK' }, memberStatsQuery)
      .then(stats =>
        got.post(responseUrl, {
          body: JSON.stringify(memberStatsResponse(stats, memberId)),
        }),
      )
      .catch(error => {
        got.post(responseUrl, {
          body: JSON.stringify(errorResponse),
        })
      })
  } else if (channelParsedArgs) {
    const channelId = channelParsedArgs[1]

    client.query
      .channelStats({ channelId, timePeriod: 'WEEK' }, channelStatsQuery)
      .then(stats =>
        got.post(responseUrl, {
          body: JSON.stringify(channelStatsResponse(stats, channelId)),
        }),
      )
      .catch(error =>
        got.post(responseUrl, {
          body: JSON.stringify(errorResponse),
        }),
      )
  } else {
    return { text: 'You need to specify what stats you want 🙃' }
  }

  return { text: 'Getting stats...' }
}

export default stats
