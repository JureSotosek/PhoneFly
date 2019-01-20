import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'
import Button from '../components/button'

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

const BlackButton = styled(Button)`
  background-color: black;
  color: white;
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

const ShareButton = styled(Button)`
  width: 80%;
  font-size: 6vw;
`

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
}

type State = {
  startedFallingAt: ?Date,
  highestFallHeight: number,
  loadingBestScore: boolean,
  bestScore: number,
  prompt: string,
}

class Play extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      startedFallingAt: null,
      highestFallHeight: 0,
      loadingBestScore: false,
      bestScore: 0,
      prompt: 'How high can you throw your phone?',
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
    const { startedFallingAt, highestFallHeight, bestScore } = this.state
    const { FBInstant } = this.props

    const {
      x,
      y,
      z,
    }: { x: number, y: number, z: number } = event.accelerationIncludingGravity
    const {
      alpha,
      beta,
      gamma,
    }: { alpha: number, beta: number, gamma: number } = event.rotationRate

    const acceleration = (x ** 2 + y ** 2 + z ** 2) ** 0.5 < 3
    const beta2 = Math.pow(beta, 2)
    const gamma2 = Math.pow(gamma, 2)
    const rotation = z < 5 && (beta2 > 40000 || gamma2 > 40000)

    if ((acceleration || rotation) && !startedFallingAt) {
      this.setState({ startedFallingAt: new Date() })
    } else if (!acceleration && !rotation && startedFallingAt != null) {
      const fallLasted = new Date() - startedFallingAt
      const height = (9.81 * (fallLasted / 2000) ** 2) / 2
      const heightRounded = parseInt(height * 100) / 100

      if (heightRounded > highestFallHeight) {
        this.setState({
          highestFallHeight: heightRounded,
        })

        if (bestScore < heightRounded && FBInstant != null) {
          this.setBestScore(heightRounded)
        }
      }

      this.setState({ startedFallingAt: null })
    }
  }

  getBestScore: () => void = () => {
    const { FBInstant } = this.props

    this.setState({ loadingBestScore: true })

    FBInstant.getLeaderboardAsync('score')
      .then(leaderboard => {
        return leaderboard.getPlayerEntryAsync()
      })
      .then(entry => {
        const bestScore = entry.getScore()
        if (bestScore) {
          this.setState({ bestScore: bestScore / 100, loadingBestScore: false })
        }
      })
      .catch(() => {
        this.setState({ loadingBestScore: false })
      })
  }

  setBestScore: number => void = (score: number) => {
    const { prompt } = this.state
    const { FBInstant } = this.props

    FBInstant.getLeaderboardAsync('score')
      .then(leaderboard => {
        return leaderboard.setScoreAsync(parseInt(score * 100))
      })
      .then(entry => {
        this.getBestScore()
      })
  }

  share: () => void = () => {
    const { bestScore } = this.state
    const { FBInstant, assets } = this.props

    FBInstant.shareAsync({
      intent: 'SHARE',
      image: assets.IndexBanner,
      text: `My high score in PhoneFly is ${bestScore}m🔥`,
    }).catch(console.log)
  }

  render() {
    const {
      highestFallHeight,
      bestScore,
      loadingBestScore,
      prompt,
    } = this.state
    const { history, assets = {} } = this.props

    return (
      <Wrapper>
        <TopWrapper>
          <Prompt>{prompt}</Prompt>
          <Banner src={assets.PlayBanner} alt="PhoneFly" />
        </TopWrapper>
        <BottomWrapper>
          <ScoreWrapper>
            <CurrentScore>Score: {highestFallHeight}m</CurrentScore>
            <BestScoreWrapper>
              <BestScore>
                {loadingBestScore ? 'Loading...' : `Best: ${bestScore}m`}
              </BestScore>
              <ShareButton onClick={this.share}>SHARE</ShareButton>
            </BestScoreWrapper>
          </ScoreWrapper>
          <ButtonsWrapper>
            <BlackButton
              onClick={() => this.setState({ highestFallHeight: 0 })}
            >
              RESET
            </BlackButton>
            <Button onClick={() => history.push('')}>BACK</Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    )
  }
}

export default Play
