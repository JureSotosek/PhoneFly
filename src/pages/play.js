import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'

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
  height: 40vw;
  padding: 5vw;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  text-align: center;
  font-size: 8vw;
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
  margin-bottom: 2vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const ResetButton = styled.div`
  border: none;

  width: 45%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  font-size: 8vw;
  font-family: 'Capriola';
`

const BackButton = styled.div`
  border: none;

  width: 45%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-size: 8vw;
  font-family: 'Capriola';
`

const ScoreWrapper = styled.div`
  margin-left: 5vw;
  margin-right: 5vw;
  margin-bottom: 2vw;
  padding: 5vw;
  border-radius: 6vw;
  background-color: #f9f9f9;
  font-size: 6vw;
  font-family: 'Capriola';
  text-align: center;
`

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
}

type State = {
  startedFallingAt: ?Date,
  highestFallLasted: number,
}

class Play extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      startedFallingAt: null,
      highestFallLasted: 0,
    }
  }

  componentDidMount() {
    window.addEventListener('devicemotion', this.handleAccelerometer, true)
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.handleAccelerometer, true)
  }

  handleAccelerometer: (event: any) => void = event => {
    const { startedFallingAt, highestFallLasted } = this.state
    const {
      x,
      y,
      z,
    }: { x: number, y: number, z: number } = event.accelerationIncludingGravity

    const acceleration = (x ** 2 + y ** 2 + z ** 2) ** 0.5

    if (acceleration < 2 && !startedFallingAt) {
      this.setState({ startedFallingAt: new Date() })
    } else if (acceleration > 2 && startedFallingAt != null) {
      const fallLasted = new Date() - startedFallingAt
      if (highestFallLasted === null || fallLasted > highestFallLasted) {
        this.setState({
          highestFallLasted: fallLasted,
        })
      }
      this.setState({ startedFallingAt: null })
    }
  }

  render() {
    const { highestFallLasted } = this.state
    const { history, assets = {} } = this.props

    const height = (9.81 * (highestFallLasted / 2000) ** 2) / 2

    return (
      <Wrapper>
        <TopWrapper>
          <Prompt>How high can you throw you phone?</Prompt>{' '}
          <Banner src={assets.PlayBanner} alt="PhoneFly" />
        </TopWrapper>
        <BottomWrapper>
          <ScoreWrapper>Score: {height.toFixed(2)}m</ScoreWrapper>
          <ButtonsWrapper>
            <ResetButton
              onClick={() => this.setState({ highestFallLasted: 0 })}
            >
              RESET
            </ResetButton>
            <BackButton onClick={() => history.push('')}>BACK</BackButton>
          </ButtonsWrapper>
        </BottomWrapper>
      </Wrapper>
    )
  }
}

export default Play
