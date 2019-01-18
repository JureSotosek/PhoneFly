import React from 'react'

import styled from 'styled-components'

const LeaderboardWrapper = styled.div`
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LeaderboardCard = styled.div`
  width: 100%;
  height: 12vw;
  margin-bottom: 2vw;
  border-radius: 2vw;
  box-shadow: 0 0.3vw 1vw #d6d6d6;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: white;
  font-family: 'Capriola';
`

const MeLeaderboardCard = styled(LeaderboardCard)`
  box-shadow: 0 0 2vw #f5a623;
`
const LoadingLeaderboardCard = styled(LeaderboardCard)`
  justify-content: center;
  font-size: 5vw;
`

const HorizontalDivider = styled.div`
  width: 60%;
  height: 0.4vw;
  background-color: #cbcbcb;
  margin-bottom: 2vw;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const UserRank = styled.div`
  padding: 4vw;
  padding-bottom: 5vw;
  font-size: 5vw;
`

const VerticalDivider = styled.div`
  width: 0.2vw;
  height: 8vw;
  background-color: #979797;
`

const UserImage = styled.img`
  width: 8vw;
  height: 8vw;
  margin: 2vw;
  border-radius: 4vw;
`

const UserName = styled.div`
  font-size: 4.5vw;
`

const Score = styled.div`
  padding: 4vw;
  font-size: 4.5vw;
`

type Entry = {
  rank: number,
  name: string,
  image: string,
  score: number,
}

type Props = {
  FBInstant: any,
}

type State = {
  meEntry: ?Entry,
  entries: ?(Entry[]),
  loadingMeEntry: boolean,
  loadingEntries: boolean,
}

class Leaderboard extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      meEntry: null,
      entries: null,
      loadingMeEntry: false,
      loadingEntries: false,
    }
  }

  componentDidMount() {
    this.getEntries()
    this.getMeEntry()
  }

  getEntries() {
    const { FBInstant } = this.props

    this.setState({ loadingEntries: true })

    FBInstant.getLeaderboardAsync('score')
      .then(leaderboard => {
        return leaderboard.getConnectedPlayerEntriesAsync()
      })
      .then(entries => {
        const normalizedEntries: Entry[] = entries.map(entry => {
          const player = entry.getPlayer()

          return {
            rank: entry.getRank(),
            name: player.getName(),
            image: player.getPhoto(),
            score: entry.getScore() / 100,
          }
        })

        this.setState({ entries: normalizedEntries, loadingEntries: false })
      })
      .catch(() => this.setState({ loadingEntries: false }))
  }

  getMeEntry() {
    const { FBInstant } = this.props

    this.setState({ loadingMeEntry: true })

    FBInstant.getLeaderboardAsync('score')
      .then(leaderboard => {
        return leaderboard.getPlayerEntryAsync()
      })
      .then(meEntry => {
        const player = meEntry.getPlayer()

        const normalizedMeEntry = {
          rank: meEntry.getRank(),
          name: player.getName(),
          image: player.getPhoto(),
          score: meEntry.getScore() / 100,
        }

        this.setState({ meEntry: normalizedMeEntry, loadingMeEntry: false })
      })
      .catch(() => this.setState({ loadingEntries: false }))
  }

  renderEntries(): any {
    const { entries, loadingEntries } = this.state

    if (loadingEntries) {
      return <LoadingLeaderboardCard>Loading...</LoadingLeaderboardCard>
    } else if (entries != null) {
      return entries.map((entry: Entry) => (
        <LeaderboardCard>
          <UserWrapper>
            <UserRank>{entry.rank}</UserRank>
            <VerticalDivider />
            <UserImage src={entry.image} />
            <UserName>{entry.name}</UserName>
          </UserWrapper>
          <Score>{entry.score}m</Score>
        </LeaderboardCard>
      ))
    }
  }

  renderMeEntry(): any {
    const { meEntry, loadingMeEntry } = this.state

    if (loadingMeEntry) {
      return <LoadingLeaderboardCard>Loading...</LoadingLeaderboardCard>
    } else if (meEntry != null) {
      return (
        <>
          <MeLeaderboardCard>
            <UserWrapper>
              <UserRank>{meEntry.rank}</UserRank>
              <VerticalDivider />
              <UserImage src={meEntry.image} />
              <UserName>{meEntry.name}</UserName>
            </UserWrapper>
            <Score>{meEntry.score}m</Score>
          </MeLeaderboardCard>
          <HorizontalDivider />
        </>
      )
    }
  }

  render() {
    return (
      <LeaderboardWrapper>
        {this.renderMeEntry()}
        {this.renderEntries()}
      </LeaderboardWrapper>
    )
  }
}

export default Leaderboard
