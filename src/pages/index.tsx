import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { IAssets, IFBInstant, Units } from '../types'

import styled from 'styled-components'
import Button from '../components/button'
import UnitsSwitch from '../components/unitsSwitch'
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

const Disclamer = styled.div`
  margin-top: 1vw;
  margin-bottom: 2vw;
  margin-left: 5vw;
  margin-right: 5vw;
  text-align: center;
  font-size: 4vw;
  font-family: 'Capriola';
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
  box-shadow: 0 0 2vw #555555;
`

const InviteButton = styled(Button)`
  width: 48%;
`

interface IProps extends RouteComponentProps {
  assets: IAssets
  FBInstant: IFBInstant
}

interface IState {
  unitsLoading: boolean
  units: Units
}

class Index extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      unitsLoading: false,
      units: 'metric',
    }
  }

  public componentDidMount() {
    this.getUnits()
    this.promptShortcut()
  }

  public getUnits = async () => {
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

  public promptShortcut = async () => {
    const { FBInstant } = this.props

    try {
      const leaderboard = await FBInstant.getLeaderboardAsync('score')
      const meEntry = await leaderboard.getPlayerEntryAsync()

      if (meEntry != null) {
        const canCreateShortcut = await FBInstant.canCreateShortcutAsync()
        if (canCreateShortcut) {
          FBInstant.createShortcutAsync()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  public onChallengeSend = async () => {
    const { FBInstant, history } = this.props

    try {
      await FBInstant.context.chooseAsync()
      history.push({
        pathname: '/challenge',
        state: { newChallenge: true },
      })
    } catch (error) {
      if (error.code === 'SAME_CONTEXT') {
        history.push({
          pathname: '/challenge',
          state: { newChallenge: true },
        })
      }
      console.log(error)
    }
  }

  public onPlay = () => {
    const { history } = this.props

    history.push('/play')
  }

  public onInvite = async () => {
    const { assets, FBInstant } = this.props

    try {
      await FBInstant.shareAsync({
        intent: 'SHARE',
        image: assets.IndexBanner,
        text: `Check out PhoneFly🔥`,
      })
      FBInstant.logEvent('inviteSent')
    } catch (error) {
      console.log(error)
    }
  }

  public onUnitsChange = async () => {
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

  public render() {
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
          <Disclamer>
            {'Made by '}
            <a href="https://github.com/juresotosek">{'@juresotosek'}</a>
            {', not 🙅🏽‍♂️ responsible for any damages that may occur❗️'}
          </Disclamer>
          <ButtonsWrapper>
            <PlayButton
              color={'black'}
              fontColor={'white'}
              onClick={this.onPlay}
            >
              {'PLAY'}
            </PlayButton>
            <ChallengeButton
              color={'white'}
              fontColor={'black'}
              onClick={this.onChallengeSend}
            >
              {'CHALLENGE'}
            </ChallengeButton>
          </ButtonsWrapper>
          <ButtonsWrapper>
            <InviteButton
              color={'white'}
              fontColor={'black'}
              onClick={this.onInvite}
            >
              {'INVITE'}
            </InviteButton>
            <UnitsSwitch units={units} onChange={this.onUnitsChange} />
          </ButtonsWrapper>
          <LeaderboardTitle>{'Leaderboard:'}</LeaderboardTitle>
          <Leaderboard FBInstant={FBInstant} units={units} />
        </Wrapper>
      </>
    )
  }
}

export default Index
