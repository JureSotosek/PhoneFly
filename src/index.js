import React from 'react'
import ReactDOM from 'react-dom'

import { MemoryRouter, Route, Switch } from 'react-router-dom'

import styled from 'styled-components'

import IndexPage from './pages/index'
import PlayPage from './pages/play'

//FB Instant

const FBInstant = window.FBInstant
const assets = window.assets

//React App

const Wrapper = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  overflow: hidden;

  background-color: #f9f9f9;
`

const App = () => (
  <MemoryRouter>
    <Wrapper>
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
            <IndexPage
              history={history}
              assets={assets}
              FBInstant={FBInstant}
            />
          )}
        />
      </Switch>
    </Wrapper>
  </MemoryRouter>
)

const app = document.getElementById('app')

if (app != null) {
  ReactDOM.render(<App />, app)
}

module.hot.accept()
