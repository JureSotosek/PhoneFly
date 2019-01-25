import React from 'react'
import { Redirect } from 'react-router-dom'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'
import Button from '../components/button'

import Leaderboard from '../containers/Leaderboard'

const Background = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: #f9f9f9;
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
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

const LeaderboardTitle = styled.div`
  margin-left: 5vw;
  font-size: 8vw;
  font-family: 'Capriola';
`

const PlayButton = styled(Button)`
  width: 35%;
`

const ChallengeButton = styled(Button)`
  width: 55%;
`

type Assets = {
  IndexBanner: string,
  PlayBanner: string,
  ChallengeImage: string,
  HighScoreImage: string,
}

type Props = {
  history: RouterHistory,
  assets: Assets,
  FBInstant: any,
}

const Index = ({ history, assets, FBInstant }: Props) => {
  const onChallengeSend: () => void = () => {
    history.push('sendChallenge')
  }

  const onPlay: () => void = () => {
    history.push('play')
  }
  return (
    <>
      <Background />
      <Wrapper>
        <Banner src={assets.IndexBanner} alt="PhoneFly" />
        <ButtonsWrapper>
          <PlayButton color={'white'} fontColor={'black'} onClick={onPlay}>
            PLAY
          </PlayButton>
          <ChallengeButton
            color={'black'}
            fontColor={'white'}
            onClick={onChallengeSend}
          >
            CHALLENGE
          </ChallengeButton>
        </ButtonsWrapper>
        <LeaderboardTitle>Leaderboard:</LeaderboardTitle>
        <Leaderboard FBInstant={FBInstant} />
      </Wrapper>
    </>
  )
}

export default Index
