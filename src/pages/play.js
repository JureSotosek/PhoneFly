import React, { Component } from 'react'
import withFallDetection from '../fallDetection/withFallDetection'
import { toImperial, formatScore } from '../utils'
import type { RouterHistory } from 'react-router-dom'
import type { Assets, Units } from '../types'

import styled from 'styled-components'
import Button from '../components/button'
import {
  Wrapper,
  TopWrapper,
  Prompt,
  Banner,
  BottomWrapper,
  ButtonsWrapper,
  ScoreWrapper,
  CurrentScore,
  BottomScoreWrapper,
} from '../components/playScreen'

const StyledPrompt = styled(Prompt)`
  height: 55vw;
  padding: 5vw;
  padding-bottom: 0;

  justify-content: center;
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
  assets: Assets,
  FBInstant: any,
  highestFallHeight: number,
  bestScore: number,
  loadingBestScore: boolean,
  prompt: string,
  bestScoreBroken: boolean,
  disableButtons: boolean,
  onReset: () => void,
}

type State = {
  unitsLoading: boolean,
  units: Units,
}

class Play extends Component<Props, State> {
  constructor() {
    super()

    this.state = {
      unitsLoading: false,
      units: 'metric',
    }
  }

  componentDidMount() {
    this.getUnits()
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

  share: () => void = () => {
    const { FBInstant, assets, bestScore, disableButtons } = this.props

    if (!disableButtons) {
      FBInstant.shareAsync({
        intent: 'SHARE',
        image: assets.HighScoreImage,
        text: `My high score in PhoneFly is ${formatScore(bestScore)}🔥`,
      })
    }
  }

  render() {
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

    return (
      <Wrapper>
        <TopWrapper>
          <StyledPrompt>{prompt}</StyledPrompt>
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
            <BottomScoreWrapper>
              <BestScore>
                {loadingBestScore
                  ? 'Loading...'
                  : `Best: ${
                      units === 'metric'
                        ? bestScore.toFixed(2)
                        : toImperial(bestScore)
                    }${units === 'metric' ? 'm' : '"'}`}
              </BestScore>
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
              disabled={disableButtons || highestFallHeight === 0}
              color={'black'}
              fontColor={'white'}
              onClick={onReset}
            >
              {'RESET'}
            </Button>
            <Button
              disabled={disableButtons}
              color={'white'}
              fontColor={'black'}
              onClick={() => {
                if (!disableButtons) {
                  history.push('/')
                }
              }}
            >
              {'BACK'}
            </Button>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    )
  }
}

export default withFallDetection(Play)
