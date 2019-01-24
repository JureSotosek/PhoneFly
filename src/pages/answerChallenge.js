import React from 'react'
import { Redirect } from 'react-router-dom'
import type { RouterHistory } from 'react-router-dom'

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

type EntryPointData = {
  challengedBy: string,
  height: number,
  id: string,
}

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
  entryPointData: ?EntryPointData,
}

type State = {
  startedFallingAt: ?Date,
  highestFallHeight: number,
  lastRecordAt: Date,
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
        startedFallingAt: null,
        highestFallHeight: 0,
        lastRecordAt: new Date(),
        prompt: `${challengedBy} 🎮 challenged you. Beat their ${height.toFixed(
          2,
        )}m to send challange back🔥`,
        disableButtons: false,
        disableButtonsTimeout: null,
      }
    }
  }

  componentDidMount() {
    window.addEventListener('devicemotion', this.handleAccelerometer, true)
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.handleAccelerometer, true)
  }

  handleAccelerometer: (event: any) => void = event => {
    const {
      startedFallingAt,
      highestFallHeight,
      lastRecordAt,
      disableButtonsTimeout,
    } = this.state
    const { FBInstant } = this.props

    const {
      x,
      y,
      z,
    }: { x: number, y: number, z: number } = event.accelerationIncludingGravity
    const {
      alpha,
      beta,
      gamma,
    }: { alpha: number, beta: number, gamma: number } = event.rotationRate

    const accelerationThreshold = (x ** 2 + y ** 2 + z ** 2) ** 0.5 < 3
    const alpha2 = Math.pow(alpha, 2)
    const beta2 = Math.pow(beta, 2)
    const gamma2 = Math.pow(gamma, 2)
    const rotationTreshold =
      z < 5 && (beta2 > 40000 || gamma2 > 40000 || alpha2 > 40000)

    if (
      (accelerationThreshold || rotationTreshold) &&
      startedFallingAt === null
    ) {
      //Fall started
      this.setState({ startedFallingAt: new Date() })
    } else if (
      !accelerationThreshold &&
      !rotationTreshold &&
      startedFallingAt != null
    ) {
      //Fall finished
      const fallLasted = new Date() - startedFallingAt
      const sinceLastRecord = new Date() - lastRecordAt
      const height = (9.81 * (fallLasted / 2000) ** 2) / 2
      const heightRounded = parseInt(height * 100) / 100

      if (heightRounded > highestFallHeight && sinceLastRecord < 100) {
        //Best local score + pause bug detection
        this.setState({
          highestFallHeight: heightRounded,
        })
      }
      const newDisableButtonsTimeout = setTimeout(() => {
        //Cancel dissabled buttons
        if (newDisableButtonsTimeout === this.state.disableButtonsTimeout) {
          this.setState({ disableButtons: false })
        }
      }, 750)

      this.setState({
        startedFallingAt: null,
        disableButtonsTimeout: newDisableButtonsTimeout,
      })
    } else if (startedFallingAt != null) {
      //Fall in progress but not finished
      const fallLasted = new Date() - startedFallingAt

      if (fallLasted > 500) {
        //Ignore small/accidental throws
        this.setState({
          disableButtons: true,
          disableButtonsTimeout: null,
        })
      }
    }
    this.setState({
      lastRecordAt: new Date(),
    })
  }

  answerChallenge: () => void = () => {
    const { highestFallHeight, disableButtons } = this.state
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
          image: assets.IndexBanner,
          text: `Haa! I beat it. New score to beat: ${highestFallHeight.toFixed(
            2,
          )}m🔥`,
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
    const { highestFallHeight, prompt, disableButtons } = this.state
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
              <CurrentScore>{`Score: ${highestFallHeight.toFixed(
                2,
              )}m`}</CurrentScore>
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
