import React from "react";
import ReactDOM from "react-dom";

// import { ApolloProvider } from "react-apollo";
// import client from "./lib/graphql/apolloClient";

import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;

  font-family: Source Sans Pro;
`;

const App = () => (
  //<ApolloProvider client={client}>
  <Wrapper>hej</Wrapper>
  //</ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("app"));

module.hot.accept();
