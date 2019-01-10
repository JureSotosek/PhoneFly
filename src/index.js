import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

// import { ApolloProvider } from "react-apollo";
// import client from "./lib/graphql/apolloClient";

import styled from "styled-components";

import IndexPage from "./pages/index";
import PlayPage from "./pages/play";
import SharePage from "./pages/share";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;

  font-family: Source Sans Pro;
`;

const App = () => (
  //<ApolloProvider client={client}>
  <BrowserRouter>
    <Switch>
      <Route path="/play" component={PlayPage} />
      <Route path="/share" component={SharePage} />
      <Route path="/" component={IndexPage} />
    </Switch>
  </BrowserRouter>
  //</ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("app"));

module.hot.accept();
