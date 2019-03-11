import * as React from 'react'
import FallDetectionEngine from './fallDetectionEngine'
import { formatScore } from '../utils'
import { RouteComponentProps } from 'react-router-dom'
import AdManager from '../adManager'
import { EntryPointData } from '../types'

const fallDetectionEngine = new FallDetectionEngine()

interface ComponentProps extends RouteComponentProps {
  assets: any
  FBInstant: any
  adManager: AdManager
  entryPointData?: EntryPointData
  highestFallHeight: number
  bestScore: number
  loadingBestScore: boolean
  prompt: string
  bestScoreBroken: boolean
  disableButtons: boolean
  onReset: () => any
}

interface Props extends RouteComponentProps {
  assets: any
  FBInstant: any
  adManager: AdManager
  entryPointData?: EntryPointData
}

interface State {
  highestFallHeight: number
  throwCounter: number
  loadingBestScore: boolean
  bestScore: number
  bestScoreBroken: boolean
  prompt: string
  disableButtons: boolean
  disableButtonsTimeout: NodeJS.Timeout
  showAdd: boolean
  addLoaded: boolean
}

const withFallDetection = (
  MyComponent: React.ComponentType<ComponentProps>,
) => {
  return class extends React.Component<Props, State> {
    constructor(props) {
      super(props)

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

    onInvalidFall = () => {
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

    setBestScore = async (score: number) => {
      const { prompt } = this.state
      const { FBInstant } = this.props

      try {
        const leaderboard = await FBInstant.getLeaderboardAsync('score')
        await leaderboard.setScoreAsync(Math.floor(score * 100))
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

      return (
        <MyComponent
          highestFallHeight={highestFallHeight}
          bestScore={bestScore}
          loadingBestScore={loadingBestScore}
          prompt={prompt}
          bestScoreBroken={bestScoreBroken}
          disableButtons={disableButtons}
          onReset={this.onReset}
          {...this.props}
        />
      )
    }
  }
}

export default withFallDetection
