import React, { Component, type ComponentType } from 'react'
import FallDetectionEngine, { type EndedEvent } from './fallDetectionEngine'
import AdManager from '../adManager'
import { toImperial, formatScore } from '../utils'
import type { RouterHistory } from 'react-router-dom'
import type { Assets, Units } from '../types'

const fallDetectionEngine = new FallDetectionEngine()

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
  adManager: AdManager,
}

type State = {
  highestFallHeight: number,
  throwCounter: number,
  loadingBestScore: boolean,
  bestScore: number,
  bestScoreBroken: boolean,
  prompt: string,
  disableButtons: boolean,
  disableButtonsTimeout: ?TimeoutID,
}

type MyComponentProps = {
  FBInstant: any,
  history: RouterHistory,
  assets: Assets,
  highestFallHeight: number,
  bestScore: number,
  loadingBestScore: boolean,
  prompt: string,
  bestScoreBroken: boolean,
  disableButtons: boolean,
  onReset: () => void,
}

const withFallDetection: (
  MyComponent: ComponentType<MyComponentProps>,
) => ComponentType<Props> = MyComponent => {
  return class extends Component<Props, State> {
    constructor() {
      super()

      this.state = {
        highestFallHeight: 0,
        throwCounter: 0,
        loadingBestScore: false,
        bestScore: 0,
        bestScoreBroken: false,
        prompt: 'How high 🚀 can you throw your phone, literally 📱',
        disableButtons: false,
        disableButtonsTimeout: null,
        showAdd: false,
        addLoaded: false,
      }
    }

    componentDidMount() {
      const { FBInstant } = this.props

      this.getBestScore()

      fallDetectionEngine
        .on('error', this.onSupportError)
        .on('bigfall', this.onBigFallStarted)
        .on('ended', this.onFallEnded)
        .on('invalid', this.onInvalidFall)
        .start(FBInstant)
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
        prompt: 'Can you beat your high score 🙌🏼',
        bestScoreBroken: false,
      })
    }

    onFallEnded: (event: EndedEvent) => void = event => {
      const { highestFallHeight, bestScore } = this.state
      const { height, bigFall } = event

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
          if (bigFall) {
            this.showAd()
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

    showAd: () => Promise<void> = async () => {
      const { throwCounter } = this.state
      const { adManager } = this.props

      if (throwCounter % 2 === 1) {
        const adShown = await adManager.showAd()
        if (adShown) {
          this.setState({ throwCounter: throwCounter + 1 })
        }
      } else {
        this.setState({ throwCounter: throwCounter + 1 })
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

    onReset: () => void = () => {
      const { disableButtons } = this.state
      if (!disableButtons) {
        this.setState({
          highestFallHeight: 0,
          bestScoreBroken: false,
        })
      }
    }

    render() {
      const {
        highestFallHeight,
        bestScore,
        loadingBestScore,
        prompt,
        bestScoreBroken,
        disableButtons,
      } = this.state
      const { FBInstant, history, assets } = this.props

      return (
        <MyComponent
          FBInstant={FBInstant}
          history={history}
          assets={assets}
          highestFallHeight={highestFallHeight}
          bestScore={bestScore}
          loadingBestScore={loadingBestScore}
          prompt={prompt}
          bestScoreBroken={bestScoreBroken}
          disableButtons={disableButtons}
          onReset={this.onReset}
        />
      )
    }
  }
}

export default withFallDetection
