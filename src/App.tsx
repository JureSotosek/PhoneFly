import React from 'react'
import {
  MemoryRouter,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom'
import { IAssets, IEntryPointData, IFBInstant } from './types'

import AdManager from 'adManager'
import ChallengePage from './pages/challenge'
import IndexPage from './pages/index'
import PlayPage from './pages/play'

interface IProps {
  assets: IAssets
  FBInstant: IFBInstant
  adManager: AdManager
}

export default function App({ assets, FBInstant, adManager }: IProps) {
  const entryPointData = FBInstant.getEntryPointData() as IEntryPointData
  const playerId = FBInstant.player.getID()

  const challengedBy = entryPointData ? entryPointData.challengedBy : undefined
  const heightToBeat = entryPointData ? entryPointData.height : undefined

  // Router Props

  const routerInitialEntries = [
    '/',
    {
      pathname: '/challenge',
      state: { newChallenge: false, challengedBy, heightToBeat },
    },
  ]
  const routerInitalIndex =
    entryPointData != null && entryPointData.id !== playerId ? 1 : 0

  // Router Renders

  function renderChallenge(props: RouteComponentProps) {
    return (
      <ChallengePage
        assets={assets}
        FBInstant={FBInstant}
        adManager={adManager}
        entryPointData={entryPointData}
        {...props}
      />
    )
  }

  function renderPlay(props: RouteComponentProps) {
    return (
      <PlayPage
        assets={assets}
        FBInstant={FBInstant}
        adManager={adManager}
        {...props}
      />
    )
  }

  function renderIndex(props: RouteComponentProps) {
    return (
      <IndexPage
        assets={assets}
        FBInstant={FBInstant}
        adManager={adManager}
        {...props}
      />
    )
  }

  return (
    <MemoryRouter
      initialEntries={routerInitialEntries}
      initialIndex={routerInitalIndex}
    >
      <Switch>
        <Route path="/challenge" render={renderChallenge} />
        <Route path="/play" render={renderPlay} />
        <Route path="/" render={renderIndex} />
      </Switch>
    </MemoryRouter>
  )
}
