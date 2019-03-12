import * as React from 'react'
import { render } from 'react-dom'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { EntryPointData } from './types'

import Client from './client'
import AdManager from './adManager'
import IndexPage from './pages/index'
import PlayPage from './pages/play'
import ChallengePage from './pages/challenge'

//FB Instant

interface MyWindow extends Window {
  FBInstant: any
  assets: any
}

const FBInstant = (window as MyWindow).FBInstant
const assets = (window as MyWindow).assets
const adManager = new AdManager(FBInstant)

const client = new Client()

client.query
  .pendingChallenges({ playerId: '', signature: '' })
  .then(console.log)
  .catch(console.log)
//React App

const App = () => {
  const entryPointData: EntryPointData = FBInstant.getEntryPointData()
  const playerId = FBInstant.player.getID()
  console.log('EntryPointData:', entryPointData)

  let challengedBy
  let heightToBeat
  if (entryPointData != null) {
    const { challengedBy: myChallengedBy, height } = entryPointData
    challengedBy = myChallengedBy
    heightToBeat = height
  }

  return (
    <MemoryRouter
      initialEntries={[
        '/',
        {
          pathname: '/challenge',
          state: { newChallenge: false, challengedBy, heightToBeat },
        },
      ]}
      initialIndex={
        entryPointData != null && entryPointData.id != playerId ? 1 : 0
      }
    >
      <Switch>
        <Route
          path="/challenge"
          render={props => (
            <ChallengePage
              assets={assets}
              FBInstant={FBInstant}
              adManager={adManager}
              entryPointData={entryPointData}
              {...props}
            />
          )}
        />
        <Route
          path="/play"
          render={props => (
            <PlayPage
              assets={assets}
              FBInstant={FBInstant}
              adManager={adManager}
              {...props}
            />
          )}
        />
        <Route
          path="/"
          render={props => (
            <IndexPage
              assets={assets}
              FBInstant={FBInstant}
              adManager={adManager}
              {...props}
            />
          )}
        />
      </Switch>
    </MemoryRouter>
  )
}

const app = document.getElementById('app')

render(<App />, app)
