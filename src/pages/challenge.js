import React, { Component } from 'react'
import withAcceleration from '../fallDetection/withFallDetection'
import { toImperial, formatScore } from '../utils'
import type { RouterHistory, Location } from 'react-router-dom'
import type { Assets, Units } from '../types'

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
    let prompt: string = `Sending a challenge 🎮 Let it fly...`
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
        history.push('')
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const { units, heightToBeat, prompt } = this.state
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
                onClick={this.sendChallenge}
              >
                SEND
              </ChallangeButton>
            </BestScoreWrapper>
          </ScoreWrapper>
          <ButtonsWrapper>
            <Button
              disabled={disableButtons || highestFallHeight === 0}
              color={'white'}
              fontColor={'black'}
              onClick={onReset}
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

export default withAcceleration(Challenge)
