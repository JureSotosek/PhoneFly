import * as got from 'got'
import { Interaction } from '../types'
import { TimePeriod } from '../generated/client'
import { memberStatsQuery } from '../utils/queries'
import { errorResponse, memberStatsResponse } from '../utils/responseBuilders'

const memberStats: Interaction = (client, reqBody) => {
  const responseUrl = reqBody.response_url

  const [memberId, timePeriod] = reqBody.actions[0].value.split('-')

  client.query
    .memberStats(
      { memberId, timePeriod: timePeriod as TimePeriod },
      memberStatsQuery,
    )
    .then(stats =>
      got.post(responseUrl, {
        body: JSON.stringify(memberStatsResponse(stats, memberId)),
      }),
    )
    .catch(error => {
      console.log(error)
      got.post(responseUrl, {
        body: JSON.stringify(errorResponse),
      })
    })

  return { text: 'Updating...' }
}

export default memberStats
