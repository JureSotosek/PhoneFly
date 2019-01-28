import React from 'react'
import { Redirect } from 'react-router-dom'
import type { RouterHistory } from 'react-router-dom'
import type { Assets, Units } from '../types'

import styled from 'styled-components'
import Button from '../components/button'
import UnitsSwitch from '../components/UnitsSwitch'

import Leaderboard from '../containers/Leaderboard'

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
`

const BackgroundTop = styled.div`
  flex: 1;
  background-color: #9af4ef;
`

const BackgroundBottom = styled.div`
  flex: 1;
  background-color: #f9f9f9;
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;

  background-color: #f9f9f9;
`

const Banner = styled.img`
  width: 100%;
`

const ButtonsWrapper = styled.div`
  padding: 2vw;
  padding-bottom: 0vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const LeaderboardTitle = styled.div`
  margin: 5vw;
  margin-bottom: 0vw;
  font-size: 8vw;
  font-family: 'Capriola';
`

const PlayButton = styled(Button)`
  width: 38%;
`

const ChallengeButton = styled(Button)`
  width: 58%;
`

const InviteButton = styled(Button)`
  width: 48%;
`

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
}

type State = { unitsLoading: boolean, units: Units }

class Index extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      unitsLoading: false,
      units: 'metric',
    }
  }

  componentDidMount() {
    this.getUnits()
  }

  getUnits: () => Promise<void> = async () => {
    const { FBInstant } = this.props

    this.setState({ unitsLoading: true })

    try {
      const data = await FBInstant.player.getDataAsync(['units'])
      if (data.units != null) {
        this.setState({ units: data.units })
      }
      this.setState({ unitsLoading: false })
    } catch (error) {
      console.log(error)
      this.setState({ unitsLoading: false })
    }
  }

  onChallengeSend: () => void = () => {
    const { history } = this.props

    history.push('sendChallenge')
  }

  onPlay: () => void = () => {
    const { history } = this.props

    history.push('play')
  }

  onInvite: () => void = () => {
    const { assets, FBInstant } = this.props

    try {
      FBInstant.shareAsync({
        intent: 'SHARE',
        image: assets.IndexBanner,
        text: `Check out PhoneFly🔥`,
      })
    } catch (error) {
      console.log(error)
    }
  }

  onUnitsChange: () => Promise<void> = async () => {
    const { FBInstant } = this.props
    const { unitsLoading, units } = this.state

    if (!unitsLoading) {
      try {
        this.setState({ unitsLoading: true })
        await FBInstant.player.setDataAsync({
          units: units === 'metric' ? 'imperial' : 'metric',
        })
        this.getUnits()
      } catch (error) {
        console.log(error)
        this.setState({ unitsLoading: false })
      }
    }
  }

  render() {
    const { units } = this.state
    const { assets, FBInstant } = this.props

    return (
      <>
        <BackgroundWrapper>
          <BackgroundTop />
          <BackgroundBottom />
        </BackgroundWrapper>
        <Wrapper>
          <Banner src={assets.IndexBanner} alt="PhoneFly" />
          <ButtonsWrapper>
            <PlayButton
              color={'black'}
              fontColor={'white'}
              onClick={this.onPlay}
            >
              PLAY
            </PlayButton>
            <ChallengeButton
              color={'white'}
              fontColor={'black'}
              onClick={this.onChallengeSend}
            >
              CHALLENGE
            </ChallengeButton>
          </ButtonsWrapper>
          <ButtonsWrapper>
            <InviteButton
              color={'white'}
              fontColor={'black'}
              onClick={this.onInvite}
            >
              INVITE
            </InviteButton>
            <UnitsSwitch units={units} onChange={this.onUnitsChange} />
          </ButtonsWrapper>
          <LeaderboardTitle>Leaderboard:</LeaderboardTitle>
          <Leaderboard FBInstant={FBInstant} units={units} />
        </Wrapper>
      </>
    )
  }
}

export default Index
