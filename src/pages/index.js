import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'
import Button from '../components/button'

import Leaderboard from '../containers/Leaderboard'

const Wrapper = styled.div`
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  position: absolute;

  background-color: #f9f9f9;
`

const Banner = styled.img`
  width: 100%;
`

const ButtonsWrapper = styled.div`
  padding: 3vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const BlackButton = styled(Button)`
  background-color: black;
  color: white;
`

const LeaderboardTitle = styled.div`
  margin-left: 5vw;
  font-size: 8vw;
  font-family: 'Capriola';
`

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
}

const Index = ({ history, assets = {}, FBInstant }: Props) => {
  const invite: () => void = () => {
    FBInstant.shareAsync({
      intent: 'INVITE',
      image: assets.IndexBanner,
      text: 'Can you beat me at PhoneFly?',
    }).catch(console.log)
  }

  return (
    <Wrapper>
      <Banner src={assets.IndexBanner} alt="PhoneFly" />
      <ButtonsWrapper>
        <BlackButton onClick={() => history.push('play')}>PLAY</BlackButton>
        <Button onClick={invite}>INVITE</Button>
      </ButtonsWrapper>
      <LeaderboardTitle>Leaderboard:</LeaderboardTitle>
      <Leaderboard FBInstant={FBInstant} />
    </Wrapper>
  )
}

export default Index
