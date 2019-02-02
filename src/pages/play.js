import React from 'react'
import type { RouterHistory } from 'react-router-dom'
import type { Assets, Units } from '../types'
import FallDetectionEngine from '../FallDetectionEngine'
import type { EndedEvent } from '../FallDetectionEngine'
import { toImperial, formatScore } from '../utils'

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

  box-shadow: ${({ bestScoreBroken }) =>
    bestScoreBroken ? '0 0 2vw #f5a623' : '0 0 0'};
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

const fallDetectionEngine = new FallDetectionEngine()
let preloadedInterstitial: any = null

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
}

type State = {
  unitsLoading: boolean,
  units: Units,
  highestFallHeight: number,
  loadingBestScore: boolean,
  bestScore: number,
  prompt: string,
  bestScoreBroken: boolean,
  disableButtons: boolean,
  disableButtonsTimeout: ?TimeoutID,
  showAdd: boolean,
  addLoaded: boolean,
}

class Play extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      unitsLoading: false,
      units: 'metric',
      highestFallHeight: 0,
      loadingBestScore: false,
      bestScore: 0,
      prompt: 'How high can you throw your phone?',
      bestScoreBroken: false,
      disableButtons: false,
      disableButtonsTimeout: null,
      showAdd: false,
      addLoaded: false,
    }
  }

  componentDidMount() {
    const { FBInstant } = this.props

    this.getUnits()
    this.getBestScore()
    this.loadAdd()

    fallDetectionEngine
      .on('error', this.onSupportError)
      .on('bigfall', this.onBigFallStarted)
      .on('ended', this.onFallEnded)
      .on('invalid', this.onInvalidFall)
      .start()
  }

  componentWillUnmount() {
    fallDetectionEngine
      .removeListener('error', this.onSupportError)
      .removeListener('bigfall', this.onBigFallStarted)
      .removeListener('ended', this.onFallEnded)
      .removeListener('invalid', this.onInvalidFall)
      .stop()
  }

  onSupportError: () => void = () => {
    this.setState({ prompt: "❗️Can't play PhonePly on this device❗️" })
  }

  onBigFallStarted: () => void = () => {
    this.onBigFallHandleAdd()

    this.setState({
      disableButtons: true,
      disableButtonsTimeout: null,
      prompt: 'Can you beat your high score?',
      bestScoreBroken: false,
    })
  }

  onFallEnded: (event: EndedEvent) => void = event => {
    const { highestFallHeight, bestScore } = this.state
    const { height } = event

    if (height > highestFallHeight) {
      this.setState({
        highestFallHeight: height,
      })

      if (bestScore < height) {
        this.setBestScore(height)
        this.setState({
          bestScore: height,
          prompt: 'New High Score!🥳🎉',
          bestScoreBroken: true,
        })
      }
    }
    const newDisableButtonsTimeout = setTimeout(() => {
      if (newDisableButtonsTimeout === this.state.disableButtonsTimeout) {
        this.setState({ disableButtons: false })
        if (this.state.showAdd) {
          this.showAdd()
        }
      }
    }, 750)

    this.setState({
      disableButtonsTimeout: newDisableButtonsTimeout,
    })
  }

  onInvalidFall: (sinceLastRecord: any) => void = sinceLastRecord => {
    const newDisableButtonsTimeout = setTimeout(() => {
      if (newDisableButtonsTimeout === this.state.disableButtonsTimeout) {
        this.setState({ disableButtons: false })
      }
    }, 750)

    this.setState({
      disableButtonsTimeout: newDisableButtonsTimeout,
    })
  }

  loadAdd: () => Promise<void> = async () => {
    const { FBInstant } = this.props

    try {
      const interstitial = await FBInstant.getInterstitialAdAsync(
        '746821112354806_758067227896861',
      )
      preloadedInterstitial = interstitial
      await preloadedInterstitial.loadAsync()

      this.setState({ addLoaded: true })
    } catch (error) {
      console.log(error)
    }
  }

  showAdd: () => Promise<void> = async () => {
    const { addLoaded } = this.state

    if (addLoaded) {
      try {
        await preloadedInterstitial.showAsync()
        this.setState({ showAdd: false, addLoaded: false })
        this.loadAdd()
      } catch (error) {
        console.log(error)
      }
    }
  }

  onBigFallHandleAdd: () => Promise<void> = async () => {
    const { FBInstant } = this.props

    let bigFallCounter: ?number = null

    try {
      const data = await FBInstant.player.getDataAsync(['bigFallCounter'])
      bigFallCounter = data.bigFallCounter
      if (bigFallCounter != null && (bigFallCounter + 1) % 3 === 0) {
        this.setState({ showAdd: true })
      }
    } catch (error) {
      console.log(error)
    }

    try {
      if (bigFallCounter != null) {
        await FBInstant.player.setDataAsync({
          bigFallCounter: bigFallCounter + 1,
        })
      } else {
        await FBInstant.player.setDataAsync({
          bigFallCounter: 1,
        })
      }
    } catch (error) {
      console.log(error)
    }
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
        text: `My high score in PhoneFly is ${formatScore(bestScore)}🔥`,
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
          default: `My new high score in PhoneFly is ${formatScore(
            bestScore,
          )}🔥`,
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
      units,
      highestFallHeight,
      bestScore,
      loadingBestScore,
      prompt,
      bestScoreBroken,
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
          <ScoreWrapper bestScoreBroken={bestScoreBroken}>
            <CurrentScore>
              {`Score: ${
                units === 'metric'
                  ? highestFallHeight.toFixed(2)
                  : toImperial(highestFallHeight)
              }`}
              {units === 'metric' ? 'm' : '"'}
            </CurrentScore>
            <BestScoreWrapper>
              <BestScore>
                {loadingBestScore
                  ? 'Loading...'
                  : `Best: ${
                      units === 'metric'
                        ? bestScore.toFixed(2)
                        : toImperial(bestScore)
                    }`}
                {units === 'metric' ? 'm' : '"'}
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
                  this.setState({
                    highestFallHeight: 0,
                    bestScoreBroken: false,
                  })
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
