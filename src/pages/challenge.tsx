import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { IAssets, IFBInstant } from 'types'
import AdManager from '../adManager'
import withAcceleration from '../fallDetection/withFallDetection'
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

interface IStyledPromptProps {
  newChallange: boolean
}

const StyledPrompt = styled(Prompt)<IStyledPromptProps>`
  font-size: ${({ newChallange }) => (newChallange ? '8vw' : '6vw')};
`

const ChallangeButton = styled(Button)`
  width: 100%;
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
  newChallange: boolean
  heightToBeat: number
  prompt: string
  unitsLoading: boolean
  units: string
}

class Challenge extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    const { location } = props.history
    let heightToBeat = 0
    let prompt = `Starting a challenge 🎮 Throw your phone to send it 🚀`
    let newChallange = true

    if (location.state && location.state.newChallenge === false) {
      const { challengedBy, heightToBeat: myHeightToBeat } = location.state

      heightToBeat = myHeightToBeat
      prompt = `${challengedBy} 🎮 challenged you. Beat their ${formatScore(
        heightToBeat
      )} to send the challange back🔥`
      newChallange = false
    }

    this.state = {
      heightToBeat,
      newChallange,
      prompt,
      units: 'metric',
      unitsLoading: false,
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

  public sendChallenge = async () => {
    const { heightToBeat, newChallange } = this.state
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
      let text = `Can you beat me in a challenge? My score to beat: ${formatScore(
        highestFallHeight
      )}🔥`

      if (newChallange === false) {
        text = `Haa! I beat it. New score to beat: ${formatScore(
          highestFallHeight
        )}🔥`
      }

      try {
        await FBInstant.updateAsync({
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
        FBInstant.logEvent('challengeSent')
        history.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  public render() {
    const { newChallange, heightToBeat, prompt, units } = this.state
    const {
      history,
      assets,
      highestFallHeight,
      disableButtons,
      onReset,
    } = this.props

    const currentScore =
      units === 'metric'
        ? highestFallHeight.toFixed(2)
        : toImperial(highestFallHeight)

    function handleBackButtonClick() {
      if (!disableButtons) {
        history.push('/')
      }
    }

    return (
      <Wrapper>
        <TopWrapper>
          <StyledPrompt newChallange={newChallange}>{prompt}</StyledPrompt>
          <Banner src={assets.PlayBanner} alt="PhoneFly" />
        </TopWrapper>
        <BottomWrapper>
          <ScoreWrapper>
            <CurrentScore>
              {`Score: ${currentScore}`}
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
              onClick={handleBackButtonClick}
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
