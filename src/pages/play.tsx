import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import AdManager from '../adManager'
import withFallDetection from '../fallDetection/withFallDetection'
import { IAssets, IFBInstant, Units } from '../types'
import { formatScore, toImperial } from '../utils'

import styled from 'styled-components'
import Button from '../components/button'
import {
  Banner,
  BottomScoreWrapper,
  BottomWrapper,
  ButtonsWrapper,
  CurrentScore,
  Prompt,
  ScoreWrapper,
  TopWrapper,
  Wrapper,
} from '../components/playScreen'

const StyledPrompt = styled(Prompt)`
  height: 55vw;
  padding: 5vw;
  padding-bottom: 0;

  justify-content: center;

  font-size: 8vw;
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

interface IProps extends RouteComponentProps {
  assets: IAssets
  FBInstant: IFBInstant
  adManager: AdManager
  highestFallHeight: number
  bestScore: number
  loadingBestScore: boolean
  prompt: string
  bestScoreBroken: boolean
  disableButtons: boolean
  onReset: () => any
}

interface IState {
  unitsLoading: boolean
  units: Units
}

class Play extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      unitsLoading: false,
      units: 'metric',
    }
  }

  public componentDidMount() {
    this.getUnits()
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

  public share = () => {
    const { FBInstant, assets, bestScore, disableButtons } = this.props

    if (!disableButtons) {
      FBInstant.shareAsync({
        intent: 'SHARE',
        image: assets.HighScoreImage,
        text: `My high score in PhoneFly is ${formatScore(bestScore)}🔥`,
      })
    }
  }

  public render() {
    const { units } = this.state
    const {
      history,
      assets,
      highestFallHeight,
      bestScore,
      loadingBestScore,
      prompt,
      bestScoreBroken,
      disableButtons,
      onReset,
    } = this.props

    const currentScoreString = `Score: ${
      units === 'metric'
        ? highestFallHeight.toFixed(2)
        : toImperial(highestFallHeight)
    }${units === 'metric' ? 'm' : '"'}`

    const bestScoreString = loadingBestScore
      ? 'Loading...'
      : `Best: ${
          units === 'metric' ? bestScore.toFixed(2) : toImperial(bestScore)
        }${units === 'metric' ? 'm' : '"'}`

    function handleBackButtonClick() {
      if (!disableButtons) {
        history.push('/')
      }
    }

    return (
      <Wrapper>
        <TopWrapper>
          <StyledPrompt>{prompt}</StyledPrompt>
          <Banner src={assets.PlayBanner} alt="PhoneFly" />
        </TopWrapper>
        <BottomWrapper>
          <ScoreWrapper bestScoreBroken={bestScoreBroken}>
            <CurrentScore>{currentScoreString}</CurrentScore>
            <BottomScoreWrapper>
              <BestScore>{bestScoreString}</BestScore>
              <ShareButton
                disabled={disableButtons}
                color={'white'}
                fontColor={'black'}
                onClick={this.share}
              >
                {'SHARE'}
              </ShareButton>
            </BottomScoreWrapper>
          </ScoreWrapper>
          <ButtonsWrapper>
            <Button
              disabled={disableButtons}
              color={'white'}
              fontColor={'black'}
              onClick={handleBackButtonClick}
            >
              {'BACK'}
            </Button>
            <Button
              disabled={disableButtons || highestFallHeight === 0}
              color={'black'}
              fontColor={'white'}
              onClick={onReset}
            >
              {'RESET'}
            </Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    )
  }
}

export default withFallDetection(Play)
