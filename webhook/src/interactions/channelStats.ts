import * as got from 'got'
import { Interaction } from '../types'
import { TimePeriod } from '../generated/client'
import { channelStatsQuery } from '../utils/queries'
import { errorResponse, channelStatsResponse } from '../utils/responseBuilders'

const channelStats: Interaction = (client, reqBody) => {
  const responseUrl = reqBody.response_url

  const [channelId, timePeriod] = reqBody.actions[0].value.split('-')

  client.query
    .channelStats(
      { channelId, timePeriod: timePeriod as TimePeriod },
      channelStatsQuery,
    )
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

  return { text: 'Updating stats...' }
}

export default channelStats
