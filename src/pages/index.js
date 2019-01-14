import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'

const Banner = styled.img`
  width: 100%;
`

const ButtonsWrapper = styled.div`
  padding: 3vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const PlayButton = styled.button`
  border: none;

  width: 45%;
  height: 20vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  background-color: black;
  color: white;
  font-size: 8vw;
  font-family: 'Capriola';
`

const InviteButton = styled.button`
  border: none;

  width: 45%;
  height: 20vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  background-color: white;
  font-size: 8vw;
  font-family: 'Capriola';
`

const LeaderboardTitle = styled.div`
  margin-left: 5vw;
  font-size: 8vw;
  font-family: 'Capriola';
`

const LeaderboardWrapper = styled.div`
  padding-left: 5vw;
  padding-right: 5vw;
`

const LeaderboardCard = styled.div`
  width: 100%;
  height: 10vw;
  margin-bottom: 2vw;
  border-radius: 2vw;
  box-shadow: 0 0.3vw 1vw #d6d6d6;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: white;
  font-family: 'Capriola';
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const UserRank = styled.div`
  padding: 4vw;
  font-size: 5vw;
`

const Divider = styled.div`
  width: 0.2vw;
  height: 6vw;
  background-color: #979797;
`

const UserName = styled.div`
  padding: 2vw;
  font-size: 4vw;
`

const Score = styled.div`
  padding: 4vw;
  font-size: 4vw;
`

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
}

const Index = ({ history, assets = {} }: Props) => (
  <>
    <Banner src={assets.IndexBanner} alt="PhoneFly" />
    <ButtonsWrapper>
      <PlayButton onClick={() => history.push('play')}>PLAY</PlayButton>
      <InviteButton>INVITE</InviteButton>
    </ButtonsWrapper>
    <LeaderboardTitle>Leaderboard:</LeaderboardTitle>
    <LeaderboardWrapper>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>1</UserRank>
          <Divider />
          <UserName>Jure Sotosek</UserName>
        </UserWrapper>
        <Score>2.01m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>2</UserRank>
          <Divider />
          <UserName>Matic Zavadlal</UserName>
        </UserWrapper>
        <Score>1.83m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>3</UserRank>
          <Divider />
          <UserName>Ajda Flisar</UserName>
        </UserWrapper>
        <Score>1.76m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>4</UserRank>
          <Divider />
          <UserName>Tela Ravnikar</UserName>
        </UserWrapper>
        <Score>1.43m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>5</UserRank>
          <Divider />
          <UserName>Lovro Bobnar</UserName>
        </UserWrapper>
        <Score>1.05m</Score>
      </LeaderboardCard>
    </LeaderboardWrapper>
  </>
)

export default Index
