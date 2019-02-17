import * as got from 'got'
import { Command } from '../types'
import { memberStatsQuery } from '../utils/queries'
import { errorResponse, memberStatsResponse } from '../utils/responseBuilders'

const me: Command = (args, client, reqBody) => {
  const responseUrl = reqBody.response_url

  const memberId = reqBody.user_id

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

  return { text: 'Getting stats...' }
}

export default me
