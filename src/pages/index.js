import React from 'react'

const Index = ({ history }) => (
  <div>
    <div>Phone Fly</div>
    <div>
      <button onClick={() => history.push('play')}>PLAY</button>
    </div>
    <div>
      <button>INVITE</button>
    </div>
    <div>High score: 000</div>
    <div>Leaderboard:</div>
    <div>1. Jure 2m</div>
    <div>2. Matic 1.6m</div>
    <div>3. Ajda 1m</div>
    <div>4. Tela 0.5m</div>
  </div>
)

export default Index
