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
  margin-bottom: 3vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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

type Assets = {
  IndexBanner: string,
  PlayBanner: string,
  ChallengeImage: string,
  HighScoreImage: string,
}

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
}

type State = {
  startedFallingAt: ?Date,
  highestFallHeight: number,
  lastRecordAt: Date,
  loadingBestScore: boolean,
  bestScore: number,
  prompt: string,
  disableButtons: boolean,
  disableButtonsTimeout: ?TimeoutID,
}

class Play extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      startedFallingAt: null,
      highestFallHeight: 0,
      lastRecordAt: new Date(),
      loadingBestScore: false,
      bestScore: 0,
      prompt: 'How high can you throw your phone?',
      disableButtons: false,
      disableButtonsTimeout: null,
    }
  }

  componentDidMount() {
    const { lastRecordAt } = this.state
    const { FBInstant } = this.props
    window.addEventListener('devicemotion', this.handleAccelerometer, true)
    setTimeout(() => {
      if (this.state.lastRecordAt === lastRecordAt) {
        this.setState({ prompt: "❗️Can't play PhonePly on this device❗️" })
      }
    }, 500)

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
      highestFallHeight,
      lastRecordAt,
      bestScore,
      disableButtonsTimeout,
    } = this.state
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

    const accelerationTreshold = (x ** 2 + y ** 2 + z ** 2) ** 0.5 < 3
    const alpha2 = Math.pow(alpha, 2)
    const beta2 = Math.pow(beta, 2)
    const gamma2 = Math.pow(gamma, 2)
    const rotationTreshold =
      z < 5 && (beta2 > 40000 || gamma2 > 40000 || alpha2 > 40000)

    if (
      (accelerationTreshold || rotationTreshold) &&
      startedFallingAt === null
    ) {
      //Fall started
      this.setState({ startedFallingAt: new Date() })
    } else if (
      !accelerationTreshold &&
      !rotationTreshold &&
      startedFallingAt != null
    ) {
      //Fall finished
      const fallLasted = new Date() - startedFallingAt
      const sinceLastRecord = new Date() - lastRecordAt
      const height = (9.81 * (fallLasted / 2000) ** 2) / 2
      const heightRounded = parseInt(height * 100) / 100

      if (heightRounded > highestFallHeight && sinceLastRecord < 100) {
        //Best local score + pause bug detection
        this.setState({
          highestFallHeight: heightRounded,
        })

        if (bestScore < heightRounded && FBInstant != null) {
          //Check for global high score
          this.setBestScore(heightRounded)
          this.setState({
            bestScore: heightRounded,
            prompt: 'New High Score!🥳🎉',
          })
        }
      }
      const newDisableButtonsTimeout = setTimeout(() => {
        //Cancel dissabled buttons
        if (newDisableButtonsTimeout === this.state.disableButtonsTimeout) {
          this.setState({ disableButtons: false })
        }
      }, 750)

      this.setState({
        startedFallingAt: null,
        disableButtonsTimeout: newDisableButtonsTimeout,
      })
    } else if (startedFallingAt != null) {
      //Fall in progress but not finished
      const fallLasted = new Date() - startedFallingAt

      if (fallLasted > 500) {
        //Ignore small/accidental throws
        this.setState({
          disableButtons: true,
          disableButtonsTimeout: null,
          prompt: 'Can you beat your high score?',
        })
      }
    }
    this.setState({
      lastRecordAt: new Date(),
    })
  }

  getBestScore: () => Promise<void> = async () => {
    const { FBInstant } = this.props

    this.setState({ loadingBestScore: true })

    try {
      const leaderboard = await FBInstant.getLeaderboardAsync('score')
      const entry = await leaderboard.getPlayerEntryAsync()
      const bestScore = entry.getScore()
      if (bestScore) {
        this.setState({ bestScore: bestScore / 100, loadingBestScore: false })
      }
    } catch (error) {
      this.setState({ loadingBestScore: false })
      console.log(error)
    }
  }

  setBestScore: number => Promise<void> = async (score: number) => {
    const { prompt } = this.state
    const { FBInstant } = this.props

    try {
      const leaderboard = await FBInstant.getLeaderboardAsync('score')
      const entry = await leaderboard.setScoreAsync(parseInt(score * 100))
      this.updateInContext()
      this.getBestScore()
    } catch (error) {
      console.log(error)
    }
  }

  share: () => void = () => {
    const { bestScore, disableButtons } = this.state
    const { FBInstant, assets } = this.props

    if (!disableButtons) {
      FBInstant.shareAsync({
        intent: 'SHARE',
        image: assets.HighScoreImage,
        text: `My high score in PhoneFly is ${bestScore.toFixed(2)}m🔥`,
      })
    }
  }

  updateInContext: () => void = () => {
    const { bestScore } = this.state
    const { FBInstant, assets } = this.props

    try {
      FBInstant.updateAsync({
        action: 'CUSTOM',
        image: assets.HighScoreImage,
        text: {
          default: `My new high score in PhoneFly is ${bestScore.toFixed(
            2,
          )}m🔥`,
        },
        template: 'beat_highscore',
        strategy: 'LAST',
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {
      highestFallHeight,
      bestScore,
      loadingBestScore,
      prompt,
      disableButtons,
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
            <CurrentScore>{`Score: ${highestFallHeight.toFixed(
              2,
            )}m`}</CurrentScore>
            <BestScoreWrapper>
              <BestScore>
                {loadingBestScore ? 'Loading...' : `Best: ${bestScore}m`}
              </BestScore>
              <ShareButton
                disabled={disableButtons}
                color={'white'}
                fontColor={'black'}
                onClick={this.share}
              >
                SHARE
              </ShareButton>
            </BestScoreWrapper>
          </ScoreWrapper>
          <ButtonsWrapper>
            <Button
              disabled={disableButtons}
              color={'black'}
              fontColor={'white'}
              onClick={() => {
                if (!disableButtons) {
                  this.setState({ highestFallHeight: 0 })
                }
              }}
            >
              RESET
            </Button>
            <Button
              disabled={disableButtons}
              color={'white'}
              fontColor={'black'}
              onClick={() => {
                if (!disableButtons) {
                  history.push('')
                }
              }}
            >
              BACK
            </Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    )
  }
}

export default Play
