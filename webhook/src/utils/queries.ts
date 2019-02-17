export const channelStatsQuery = `{
  kudosExchanged
  mostKudosReceivedBy {
    member {
      slackId
    }
    count
  }
  mostKudosSentBy {
    member {
      slackId
    }
    count
  }
  timePeriod
 }`

export const memberStatsQuery = `{
  kudosExchanged
  kudosSent
  kudosReceived
  mostKudosReceivedFrom {
    count
    member {
      slackId
    }
  }
  mostKudosSentTo {
    count
    member {
      slackId
    }
  }
  timePeriod
}`
