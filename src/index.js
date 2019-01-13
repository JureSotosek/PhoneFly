import React from 'react'
import ReactDOM from 'react-dom'

import { MemoryRouter, Route, Switch } from 'react-router-dom'

import styled from 'styled-components'

import IndexPage from './pages/index'
import PlayPage from './pages/play'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;

  font-family: Source Sans Pro;
`

const App = () => (
  <MemoryRouter>
    <Switch>
      <Route path="/play" component={PlayPage} />
      <Route path="/" component={IndexPage} />
    </Switch>
  </MemoryRouter>
)

const app: ?Element = document.getElementById('app')

if (app != null) {
  ReactDOM.render(<App />, app)
}

module.hot.accept()
