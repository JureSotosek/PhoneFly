import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import Cookie from "universal-cookie";

const Cookies = new Cookie();

const httpLink = new HttpLink({ uri: "placeholder" });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = Cookies.get("token");

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : null
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
});

export default client;
