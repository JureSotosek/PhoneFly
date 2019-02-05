import React from 'react'
import ReactDOM from 'react-dom'
import type { Assets, EntryPointData } from './types'

import { MemoryRouter, Route, Switch } from 'react-router-dom'

import IndexPage from './pages/index'
import PlayPage from './pages/play'
import ChallengePage from './pages/challenge'

//FB Instant

const FBInstant: any = window.FBInstant
const assets: Assets = window.assets

//React App

const App = () => {
  const entryPointData: ?EntryPointData = FBInstant.getEntryPointData()
  const playerId = FBInstant.player.getID()
  console.log('EntryPointData:', entryPointData)

  let challengedBy: string
  let heightToBeat: number
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
          render={({ history }) => (
            <ChallengePage
              history={history}
              assets={assets}
              FBInstant={FBInstant}
              entryPointData={entryPointData}
            />
          )}
        />
        <Route
          path="/play"
          render={({ history }) => (
            <PlayPage history={history} assets={assets} FBInstant={FBInstant} />
          )}
        />
        <Route
          path="/"
          render={({ history }) => (
            <IndexPage
              history={history}
              assets={assets}
              FBInstant={FBInstant}
            />
          )}
        />
      </Switch>
    </MemoryRouter>
  )
}

const app = document.getElementById('app')

if (app != null) {
  ReactDOM.render(<App />, app)
}

module.hot.accept()
