import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import ContentWrapper from './components/ContentWrapper';
import RegisteredTimes from './screens/RegisteredTimes';
import Login from './screens/Login';
import Register from './screens/Register';
import { ApolloProvider } from 'react-apollo';
import { client } from './graphql/client';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/registeredTimes">
            <ContentWrapper>
              <RegisteredTimes />
            </ContentWrapper>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
