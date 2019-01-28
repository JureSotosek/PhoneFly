import React from 'react'
import type { Units } from '../types'
import { toImperial } from '../utils'

import styled from 'styled-components'

const LeaderboardWrapper = styled.div`
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #f9f9f9;
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
  width: 4vw;
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
  rank: ?number,
  name: string,
  image: string,
  score: number,
  id: string,
}

type Props = {
  FBInstant: any,
  units: Units,
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

  async componentDidMount() {
    await this.getMeEntry()
    this.getEntries()
  }

  async getEntries() {
    const { meEntry } = this.state
    const { FBInstant, units } = this.props

    this.setState({ loadingEntries: true })

    try {
      const leaderboard = await FBInstant.getLeaderboardAsync('score')
      const entries = await leaderboard.getConnectedPlayerEntriesAsync(100, 0)

      const normalizedEntries: Entry[] = entries.map(entry => {
        const player = entry.getPlayer()
        const rank = entry.getRank()
        const name = player.getName()
        const image = player.getPhoto()
        const score = entry.getScore() / 100
        const id = player.getID()

        if (meEntry != null && meEntry.id === id) {
          this.setState({
            meEntry: { ...meEntry, rank },
          })
        }

        return {
          rank,
          name,
          image,
          score,
          id,
        }
      })

      this.setState({ entries: normalizedEntries, loadingEntries: false })
    } catch (error) {
      console.log(error)
      this.setState({ loadingEntries: false })
    }
  }

  async getMeEntry() {
    const { FBInstant, units } = this.props

    this.setState({ loadingMeEntry: true })

    try {
      const leaderboard = await FBInstant.getLeaderboardAsync('score')
      const meEntry = await leaderboard.getPlayerEntryAsync()

      const player = meEntry.getPlayer()
      const rank = meEntry.getRank()
      const name = player.getName()
      const image = player.getPhoto()
      const score = meEntry.getScore() / 100
      const id = player.getID()

      const normalizedMeEntry: Entry = {
        rank,
        name,
        image,
        score,
        id,
      }
      this.setState({ meEntry: normalizedMeEntry, loadingMeEntry: false })
    } catch (error) {
      console.log(error)
      this.setState({ loadingMeEntry: false })
    }
  }

  renderEntries(): any {
    const { entries, loadingEntries } = this.state
    const { units } = this.props

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
          <Score>
            {units === 'metric'
              ? entry.score.toFixed(2)
              : toImperial(entry.score)}
            {units === 'metric' ? 'm' : '"'}
          </Score>
        </LeaderboardCard>
      ))
    }
  }

  renderMeEntry(): any {
    const { meEntry, loadingMeEntry } = this.state
    const { units } = this.props

    if (loadingMeEntry) {
      return <LoadingLeaderboardCard>Loading...</LoadingLeaderboardCard>
    } else if (meEntry != null) {
      return (
        <>
          <MeLeaderboardCard>
            <UserWrapper>
              <UserRank>{meEntry.rank || '-'}</UserRank>
              <VerticalDivider />
              <UserImage src={meEntry.image} />
              <UserName>{meEntry.name}</UserName>
            </UserWrapper>
            <Score>
              {units === 'metric'
                ? meEntry.score.toFixed(2)
                : toImperial(meEntry.score)}
              {units === 'metric' ? 'm' : '"'}
            </Score>
          </MeLeaderboardCard>
        </>
      )
    }
  }

  render() {
    return (
      <LeaderboardWrapper>
        {this.renderMeEntry()}
        <HorizontalDivider />
        {this.renderEntries()}
      </LeaderboardWrapper>
    )
  }
}

export default Leaderboard
