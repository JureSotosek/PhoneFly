import React from 'react'
import { Redirect } from 'react-router-dom'
import type { RouterHistory } from 'react-router-dom'
import type { Assets, EntryPointData, Units } from '../types'
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
  height: 50vw;
  padding: 5vw;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  text-align: center;
  font-size: 6vw;
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

const ChallangeButton = styled(Button)`
  width: 100%;
  font-size: 6vw;
`

const fallDetectionEngine = new FallDetectionEngine()

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
  entryPointData: ?EntryPointData,
}

type State = {
  unitsLoading: boolean,
  units: Units,
  startedFallingAt: ?Date,
  highestFallHeight: number,
  lastRecordAt: Date,
  loadingBestScore: boolean,
  bestScore: number,
  prompt: string,
  disableButtons: boolean,
  disableButtonsTimeout: ?TimeoutID,
}

class AnswerChallenge extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { entryPointData } = props

    if (entryPointData != null) {
      const { challengedBy, height } = entryPointData

      this.state = {
        unitsLoading: false,
        units: 'metric',
        startedFallingAt: null,
        highestFallHeight: 0,
        lastRecordAt: new Date(),
        loadingBestScore: false,
        bestScore: 0,
        prompt: `${challengedBy} 🎮 challenged you. Beat their ${formatScore(
          height,
        )} to send challange back🔥`,
        disableButtons: false,
        disableButtonsTimeout: null,
      }
    }
  }

  componentDidMount() {
    const { lastRecordAt } = this.state
    const { FBInstant } = this.props

    this.getUnits()
    this.getBestScore()

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
    this.setState({
      disableButtons: true,
      disableButtonsTimeout: null,
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
        })
      }
    }
    const newDisableButtonsTimeout = setTimeout(() => {
      if (newDisableButtonsTimeout === this.state.disableButtonsTimeout) {
        this.setState({ disableButtons: false })
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
      this.getBestScore()
    } catch (error) {
      console.log(error)
    }
  }

  answerChallenge: () => void = () => {
    const { units, highestFallHeight, disableButtons } = this.state
    const { FBInstant, assets, history, entryPointData } = this.props

    const name = FBInstant.player.getName()

    if (
      !disableButtons &&
      entryPointData != null &&
      entryPointData.height < highestFallHeight
    ) {
      try {
        FBInstant.updateAsync({
          action: 'CUSTOM',
          image: assets.ChallengeImage,
          text: `Haa! I beat it. New score to beat: ${formatScore(
            highestFallHeight,
          )}🔥`,
          data: {
            challengedBy: name,
            height: highestFallHeight,
          },
          template: 'answer_challenge',
        })
        history.push('')
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const { units, highestFallHeight, prompt, disableButtons } = this.state
    const { history, assets = {}, entryPointData } = this.props

    if (entryPointData != null) {
      const { challengedBy, height: heightToBeat } = entryPointData

      return (
        <Wrapper>
          <TopWrapper>
            <Prompt>{prompt}</Prompt>
            <Banner src={assets.PlayBanner} alt="PhoneFly" />
          </TopWrapper>
          <BottomWrapper>
            <ScoreWrapper>
              <CurrentScore>
                {`Score: ${
                  units === 'metric'
                    ? highestFallHeight.toFixed(2)
                    : toImperial(highestFallHeight)
                }`}
                {units === 'metric' ? 'm' : '"'}
              </CurrentScore>
              <BestScoreWrapper>
                <ChallangeButton
                  disabled={disableButtons || heightToBeat >= highestFallHeight}
                  color={'black'}
                  fontColor={'white'}
                  onClick={this.answerChallenge}
                >
                  SEND BACK
                </ChallangeButton>
              </BestScoreWrapper>
            </ScoreWrapper>
            <ButtonsWrapper>
              <Button
                disabled={disableButtons}
                color={'white'}
                fontColor={'black'}
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
    } else {
      return <Redirect to={''} />
    }
  }
}

export default AnswerChallenge