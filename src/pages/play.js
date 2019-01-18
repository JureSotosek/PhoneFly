import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: #9af4ef;
`

const TopWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Prompt = styled.div`
  width: 100%;
  height: 40vw;
  padding: 5vw;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  text-align: center;
  font-size: 8vw;
  font-family: 'Capriola';

  background-color: #f9f9f9;
`

const Banner = styled.img`
  width: 100%;
`

const BottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ButtonsWrapper = styled.div`
  padding: 3vw;
  margin-bottom: 2vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const ResetButton = styled.div`
  border: none;

  width: 45%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  font-size: 8vw;
  font-family: 'Capriola';
`

const BackButton = styled.div`
  border: none;

  width: 45%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-size: 8vw;
  font-family: 'Capriola';
`

const ScoreWrapper = styled.div`
  margin-left: 5vw;
  margin-right: 5vw;
  margin-bottom: 2vw;
  padding: 5vw;
  border-radius: 6vw;
  background-color: #f9f9f9;
`

const CurrentScore = styled.div`
  margin-bottom: 5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 7vw;
  font-family: 'Capriola';
  text-align: center;
`

const BestScoreWrapper = styled.div`
  display: flex;
  align-items: center;
`

const BestScore = styled.div`
  width: 100%;
  text-align: center;
  font-size: 6vw;
  font-family: 'Capriola';
`

const ShareButton = styled.div`
  border: none;

  width: 80%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-size: 6vw;
  font-family: 'Capriola';
`

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
}

type State = {
  startedFallingAt: ?Date,
  highestFallLasted: number,
  bestScore: number,
  lastRecordedValue: Date,
}

class Play extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      startedFallingAt: null,
      highestFallLasted: 0,
      bestScore: 0,
      lastRecordedValue: new Date(),
    }
  }

  componentDidMount() {
    const { FBInstant } = this.props
    window.addEventListener('devicemotion', this.handleAccelerometer, true)

    if (FBInstant != null) {
      this.getBestScore()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.handleAccelerometer, true)
  }

  handleAccelerometer: (event: any) => void = event => {
    const {
      startedFallingAt,
      lastRecordedValue,
      highestFallLasted,
      bestScore,
    } = this.state
    const { FBInstant } = this.props
    const { x, y, z } = event.accelerationIncludingGravity
    const { alpha, beta, gamma } = event.rotationRate

    const acceleration = (x ** 2 + y ** 2 + z ** 2) ** 0.5 < 3

    const beta2 = Math.pow(beta, 2)
    const gamma2 = Math.pow(gamma, 2)
    const rotation = z < 5 && (beta2 > 40000 || gamma2 > 40000)

    if ((acceleration || rotation) && !startedFallingAt) {
      this.setState({ startedFallingAt: new Date() })
    } else if (!acceleration && !rotation && startedFallingAt != null) {
      const fallLasted = new Date() - startedFallingAt
      const fromLastRecordedValue = new Date() - lastRecordedValue
      if (
        highestFallLasted === null ||
        fallLasted > highestFallLasted ||
        fromLastRecordedValue > 500
      ) {
        this.setState({
          highestFallLasted: fallLasted,
        })

        const height = (9.81 * (fallLasted / 2000) ** 2) / 2
        const heightRounded = Math.round(height * 100) / 100
        if (bestScore < heightRounded) {
          this.setState({ bestScore: heightRounded })
        }

        if (FBInstant != null) {
          this.setBestScore(heightRounded)
        }
      }
      this.setState({ startedFallingAt: null })
    }
    this.setState({ lastRecordedValue: new Date() })
  }

  getBestScore: () => void = () => {
    const { FBInstant } = this.props

    FBInstant.getLeaderboardAsync('score')
      .then(leaderboard => {
        return leaderboard.getPlayerEntryAsync()
      })
      .then(entry => {
        const bestScore = entry.getScore()
        if (bestScore) {
          this.setState({ bestScore: bestScore / 100 })
        }
      })
  }

  setBestScore: number => void = (score: number) => {
    const { FBInstant } = this.props

    FBInstant.getLeaderboardAsync('score')
      .then(leaderboard => {
        return leaderboard.setScoreAsync(Math.round(score * 100))
      })
      .then(entry => {
        this.getBestScore()
      })
  }

  render() {
    const { highestFallLasted, bestScore } = this.state
    const { history, assets = {} } = this.props

    const height = ((9.81 * (highestFallLasted / 2000) ** 2) / 2).toFixed(2)

    return (
      <Wrapper>
        <TopWrapper>
          <Prompt>How high can you throw you phone?</Prompt>{' '}
          <Banner src={assets.PlayBanner} alt="PhoneFly" />
        </TopWrapper>
        <BottomWrapper>
          <ScoreWrapper>
            <CurrentScore>Score: {height}m</CurrentScore>
            <BestScoreWrapper>
              <BestScore>Best: {bestScore}m</BestScore>
              <ShareButton>SHARE</ShareButton>
            </BestScoreWrapper>
          </ScoreWrapper>
          <ButtonsWrapper>
            <ResetButton
              onClick={() => this.setState({ highestFallLasted: 0 })}
            >
              RESET
            </ResetButton>
            <BackButton onClick={() => history.push('')}>BACK</BackButton>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    )
  }
}

export default Play
