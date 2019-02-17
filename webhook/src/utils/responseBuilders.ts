import {
  TimePeriod,
  MemberStatsPayload,
  ChannelStatsPayload,
} from '../generated/client'
import { MessageResponse } from '../types'

// error

export const errorResponse = {
  text: 'Ohh no something went wrong 😔',
}

// stats

const timePeriods: Array<TimePeriod> = [
  'DAY',
  'WEEK',
  'MONTH',
  'HALF_YEAR',
  'YEAR',
  'ALL_TIME',
]

const humanTimePeriod = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case 'DAY':
      return 'day'
    case 'WEEK':
      return 'week'
    case 'MONTH':
      return 'month'
    case 'HALF_YEAR':
      return 'half a year'
    case 'YEAR':
      return 'year'
    case 'ALL_TIME':
      return 'all time'
  }
}

const inHumanTimePeriod = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case 'DAY':
      return 'in the last day'
    case 'WEEK':
      return 'in the last week'
    case 'MONTH':
      return 'in the last month'
    case 'HALF_YEAR':
      return 'in the last half of the year'
    case 'YEAR':
      return 'in the last year'
    case 'ALL_TIME':
      return 'yet'
  }
}

const forHumanTimePeriod = (timePeriod: TimePeriod): string => {
  switch (timePeriod) {
    case 'DAY':
      return 'for the last day'
    case 'WEEK':
      return 'for the last week'
    case 'MONTH':
      return 'for the last month'
    case 'HALF_YEAR':
      return 'for the last half of the year'
    case 'YEAR':
      return 'for the last year'
    case 'ALL_TIME':
      return 'since ever'
  }
}

export const memberStatsResponse = (
  stats: MemberStatsPayload,
  memberId: string,
): MessageResponse => {
  const {
    kudosExchanged,
    kudosReceived,
    kudosSent,
    mostKudosReceivedFrom,
    mostKudosSentTo,
    timePeriod,
  } = stats

  const possibleTimePeriods = timePeriods.filter(
    myTimePeriod => myTimePeriod != timePeriod,
  )

  const noKudosExchanged = `<@${memberId}> hasn't exchanged any kudos ${inHumanTimePeriod(
    timePeriod,
  )} 🤷🏽‍♂️`

  const title = `This are <@${memberId}>'s stats ${forHumanTimePeriod(
    timePeriod,
  )} 📈`

  return {
    text: `${
      kudosExchanged === 0
        ? noKudosExchanged
        : `${title}
    📥 Kudos received: ${kudosReceived}
    📤 Kudos sent: ${kudosSent}
    🤝 Kudos exchanged: ${kudosExchanged}
    💪🏼 Most kudos received from: ${
      kudosReceived === 0
        ? `-`
        : `<@${mostKudosReceivedFrom[0].member.slackId}>`
    }
    🙏🏻 Most kudos sent to: ${
      kudosSent === 0 ? `-` : `<@${mostKudosSentTo[0].member.slackId}>`
    }`
    }`,
    attachments: [
      {
        attachment_type: 'default',
        callback_id: 'memberStats',
        text: 'Change time period',
        actions: possibleTimePeriods.map(myTimePeriod => ({
          name: myTimePeriod,
          text: humanTimePeriod(myTimePeriod),
          type: 'button',
          value: memberId + '-' + myTimePeriod,
        })),
      },
    ],
  }
}

export const channelStatsResponse = (
  stats: ChannelStatsPayload,
  channelId: string,
): MessageResponse => {
  const {
    kudosExchanged,
    mostKudosReceivedBy,
    mostKudosSentBy,
    timePeriod,
  } = stats

  const possibleTimePeriods = timePeriods.filter(
    myTimePeriod => myTimePeriod != timePeriod,
  )

  const noKudosExchanged = `Channel <#${channelId}> hasn't exchanged any kudos ${inHumanTimePeriod(
    timePeriod,
  )} 🤷🏽‍♂️`

  const title = `This are <#${channelId}>'s stats ${forHumanTimePeriod(
    timePeriod,
  )} 📈`

  return {
    text: `${
      kudosExchanged === 0
        ? noKudosExchanged
        : `${title}
    👋🏼 Kudos exchanged: ${kudosExchanged}
    Most kudos received by: 
    ${
      mostKudosReceivedBy.length > 0
        ? ` ${
            mostKudosReceivedBy[0]
              ? `🥇 <@${mostKudosReceivedBy[0].member.slackId}>`
              : '-'
          }
    ${
      mostKudosReceivedBy[1]
        ? `🥈 <@${mostKudosReceivedBy[1].member.slackId}>`
        : '-'
    }
    ${
      mostKudosReceivedBy[2]
        ? `🥉 <@${mostKudosReceivedBy[2].member.slackId}>`
        : '-'
    }`
        : '-'
    }
    Most kudos sent by:
    ${
      mostKudosSentBy.length > 0
        ? ` ${
            mostKudosSentBy[0]
              ? `🥇 <@${mostKudosSentBy[0].member.slackId}>`
              : '-'
          }
    ${mostKudosSentBy[1] ? `🥈 <@${mostKudosSentBy[1].member.slackId}>` : '-'}
    ${mostKudosSentBy[2] ? `🥉 <@${mostKudosSentBy[2].member.slackId}>` : '-'}`
        : '-'
    }`
    }`,
    attachments: [
      {
        attachment_type: 'default',
        callback_id: 'channelStats',
        text: 'Change time period',
        actions: possibleTimePeriods.map(myTimePeriod => ({
          name: myTimePeriod,
          text: humanTimePeriod(myTimePeriod),
          type: 'button',
          value: channelId + '-' + myTimePeriod,
        })),
      },
    ],
  }
}
