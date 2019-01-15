import React from 'react'
import type { RouterHistory } from 'react-router-dom'

import styled from 'styled-components'

const Wrapper = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;

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

const LeaderboardWrapper = styled.div`
  padding-left: 5vw;
  padding-right: 5vw;
  padding-top: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LeaderboardCard = styled.div`
  width: 100%;
  height: 12vw;
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

const MeLeaderboardCard = styled(LeaderboardCard)`
  box-shadow: 0 0 2vw #f5a623;
`

const HorizontalDivider = styled.div`
  width: 60%;
  height: 0.4vw;
  background-color: #cbcbcb;
  margin-bottom: 2vw;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const UserRank = styled.div`
  padding: 4vw;
  padding-bottom: 5vw;
  font-size: 5vw;
`

const VerticalDivider = styled.div`
  width: 0.2vw;
  height: 8vw;
  background-color: #979797;
`

const UserImage = styled.img`
  width: 8vw;
  height: 8vw;
  margin: 2vw;
  border-radius: 4vw;
`

const UserName = styled.div`
  font-size: 4.5vw;
`

const Score = styled.div`
  padding: 4vw;
  font-size: 4.5vw;
`

type Props = {
  history: RouterHistory,
  assets: any,
  FBInstant: any,
}

const Index = ({ history, assets = {} }: Props) => (
  <Wrapper>
    <Banner src={assets.IndexBanner} alt="PhoneFly" />
    <ButtonsWrapper>
      <PlayButton onClick={() => history.push('play')}>PLAY</PlayButton>
      <InviteButton>INVITE</InviteButton>
    </ButtonsWrapper>
    <LeaderboardTitle>Leaderboard:</LeaderboardTitle>
    <LeaderboardWrapper>
      <MeLeaderboardCard>
        <UserWrapper>
          <UserRank>1</UserRank>
          <VerticalDivider />
          <UserImage src={assets.Jure} />
          <UserName>Jure Sotosek</UserName>
        </UserWrapper>
        <Score>2.01m</Score>
      </MeLeaderboardCard>
      <HorizontalDivider />
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>1</UserRank>
          <VerticalDivider />
          <UserImage src={assets.Jure} />
          <UserName>Jure Sotosek</UserName>
        </UserWrapper>
        <Score>2.01m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>2</UserRank>
          <VerticalDivider />
          <UserImage src={assets.Matic} />
          <UserName>Matic Zavadlal</UserName>
        </UserWrapper>
        <Score>1.83m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>3</UserRank>
          <VerticalDivider />
          <UserImage src={assets.Ajda} />
          <UserName>Ajda Flisar</UserName>
        </UserWrapper>
        <Score>1.76m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>4</UserRank>
          <VerticalDivider />
          <UserImage src={assets.Tela} />
          <UserName>Tela Ravnikar</UserName>
        </UserWrapper>
        <Score>1.43m</Score>
      </LeaderboardCard>
      <LeaderboardCard>
        <UserWrapper>
          <UserRank>5</UserRank>
          <VerticalDivider />
          <UserImage src={assets.Lovro} />
          <UserName>Lovro Bobnar</UserName>
        </UserWrapper>
        <Score>1.05m</Score>
      </LeaderboardCard>
    </LeaderboardWrapper>
  </Wrapper>
)

export default Index
