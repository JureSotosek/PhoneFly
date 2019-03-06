import React, { Component } from 'react'
import FallDetectionEngine from './fallDetectionEngine'
import AdManager from '../adManager'
import { toImperial, formatScore } from '../utils'

const fallDetectionEngine = new FallDetectionEngine()

const withFallDetection = MyComponent => {
  return class extends Component {
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
      const { FBInstant, adManager } = this.props

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

    onSupportError = () => {
      this.setState({ prompt: "❗️Can't play PhonePly on this device❗️" })
    }

    onBigFallStarted = () => {
      this.setState({
        disableButtons: true,
        disableButtonsTimeout: null,
        prompt: 'Can you beat your high score 🙌🏼',
        bestScoreBroken: false,
      })
    }

    onFallEnded = event => {
      const { highestFallHeight, bestScore } = this.state
      const { FBInstant, adManager } = this.props
      const { height, bigFall } = event

      FBInstant.logEvent('throw', height, {
        height,
      })

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
            adManager.showAd()
          }
        }
      }, 750)

      this.setState({
        disableButtonsTimeout: newDisableButtonsTimeout,
      })
    }

    onInvalidFall = sinceLastRecord => {
      const newDisableButtonsTimeout = setTimeout(() => {
        if (newDisableButtonsTimeout === this.state.disableButtonsTimeout) {
          this.setState({ disableButtons: false })
        }
      }, 750)

      this.setState({
        disableButtonsTimeout: newDisableButtonsTimeout,
      })
    }

    getBestScore = async () => {
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

    setBestScore = async score => {
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

    updateInContext = () => {
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

    onReset = () => {
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
