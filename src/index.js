import React from 'react'
import ReactDOM from 'react-dom'

import { MemoryRouter, Route, Switch } from 'react-router-dom'

import IndexPage from './pages/index'
import PlayPage from './pages/play'
import SendChallengePage from './pages/sendChallenge'
import AnswerChallengePage from './pages/answerChallenge'

//FB Instant

const FBInstant = window.FBInstant
const assets = window.assets

//React App

type ChallangeData = {
  challengedBy: string,
  height: number,
}

type EntryPointData = {
  myReplayData: ChallangeData,
}

const App = () => {
  const entryPointData: ?EntryPointData = FBInstant.getEntryPointData()
  console.log(entryPointData)

  return (
    <MemoryRouter
      initialEntries={['', '/answerChallenge']}
      initialIndex={entryPointData != null ? 1 : 0}
    >
      <Switch>
        <Route
          path="/answerChallenge"
          render={({ history }) => (
            <AnswerChallengePage
              history={history}
              assets={assets}
              FBInstant={FBInstant}
              entryPointData={entryPointData}
            />
          )}
        />
        <Route
          path="/sendChallenge"
          render={({ history }) => (
            <SendChallengePage
              history={history}
              assets={assets}
              FBInstant={FBInstant}
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
