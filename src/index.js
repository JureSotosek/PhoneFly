import React from 'react'
import ReactDOM from 'react-dom'

import { MemoryRouter, Route, Switch } from 'react-router-dom'

import IndexPage from './pages/index'
import PlayPage from './pages/play'

//FB Instant

const FBInstant = window.FBInstant
const assets = window.assets

//React App

const App = () => (
  <MemoryRouter>
    <Switch>
      <Route
        path="/play"
        render={({ history }) => (
          <PlayPage history={history} assets={assets} FBInstant={FBInstant} />
        )}
      />
      <Route
        path="/"
        render={({ history }) => (
          <IndexPage history={history} assets={assets} FBInstant={FBInstant} />
        )}
      />
    </Switch>
  </MemoryRouter>
)

const app = document.getElementById('app')

if (app != null) {
  ReactDOM.render(<App />, app)
}

module.hot.accept()
