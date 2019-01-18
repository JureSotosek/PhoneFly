import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import Leaderboard from '../containers/Leaderboard'

import styled from 'styled-components'

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

const PlayButton = styled.div`
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

const InviteButton = styled.div`
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

const Index = ({ history, assets = {}, FBInstant }: Props) => (
  <Wrapper>
    <Banner src={assets.IndexBanner} alt="PhoneFly" />
    <ButtonsWrapper>
      <PlayButton onClick={() => history.push('play')}>PLAY</PlayButton>
      <InviteButton>INVITE</InviteButton>
    </ButtonsWrapper>
    <LeaderboardTitle>Leaderboard:</LeaderboardTitle>
    <Leaderboard FBInstant={FBInstant} />
  </Wrapper>
)

export default Index
