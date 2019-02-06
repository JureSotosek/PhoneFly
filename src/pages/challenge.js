import React, { Component } from 'react'
import withAcceleration from '../fallDetection/withFallDetection'
import { toImperial, formatScore } from '../utils'
import type { RouterHistory, Location } from 'react-router-dom'
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
  font-size: ${({ newChallange }) => (newChallange ? '8vw' : '6vw')};
`

const ChallangeButton = styled(Button)`
  width: 100%;
  font-size: 6vw;
`

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
  highestFallHeight: number,
  bestScore: number,
  loadingBestScore: boolean,
  bestScoreBroken: boolean,
  disableButtons: boolean,
  onReset: () => void,
}

type State = {
  newChallange: boolean,
  heightToBeat: number,
  prompt: string,
  unitsLoading: boolean,
  units: Units,
}

class Challenge extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { location } = props.history
    let heightToBeat: number = 0
    let prompt: string = `Starting a challenge 🎮 Throw your phone to send it 🚀`
    let newChallange: boolean = true

    if (location.state && location.state.newChallenge === false) {
      const { challengedBy, heightToBeat: myHeightToBeat } = location.state

      heightToBeat = myHeightToBeat
      prompt = `${challengedBy} 🎮 challenged you. Beat their ${formatScore(
        heightToBeat,
      )} to send the challange back🔥`
      newChallange = false
    }

    this.state = {
      newChallange,
      heightToBeat,
      prompt,
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

  sendChallenge: () => void = () => {
    const { units, heightToBeat, newChallange } = this.state
    const {
      FBInstant,
      assets,
      history,
      highestFallHeight,
      disableButtons,
    } = this.props

    const name = FBInstant.player.getName()
    const id = FBInstant.player.getID()

    if (!disableButtons && highestFallHeight > heightToBeat) {
      let text: string = `Can you beat me in a challenge? My score to beat: ${formatScore(
        highestFallHeight,
      )}🔥`

      if (newChallange === false) {
        text = `Haa! I beat it. New score to beat: ${formatScore(
          highestFallHeight,
        )}🔥`
      }

      try {
        FBInstant.updateAsync({
          action: 'CUSTOM',
          image: assets.ChallengeImage,
          text,
          data: {
            challengedBy: name,
            height: highestFallHeight,
            id,
          },
          template: 'send_challenge',
        })
        history.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const { newChallange, heightToBeat, prompt, units } = this.state
    const {
      history,
      assets,
      highestFallHeight,
      disableButtons,
      onReset,
    } = this.props

    return (
      <Wrapper>
        <TopWrapper>
          <StyledPrompt newChallange={newChallange}>{prompt}</StyledPrompt>
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
            <BottomScoreWrapper>
              <ChallangeButton
                disabled={disableButtons || heightToBeat >= highestFallHeight}
                color={'black'}
                fontColor={'white'}
                onClick={this.sendChallenge}
              >
                {'SEND'}
              </ChallangeButton>
            </BottomScoreWrapper>
          </ScoreWrapper>
          <ButtonsWrapper>
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
            <Button
              disabled={disableButtons || highestFallHeight === 0}
              color={'white'}
              fontColor={'black'}
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

export default withAcceleration(Challenge)
