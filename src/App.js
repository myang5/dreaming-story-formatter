import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import HowTo from './HowTo.js';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';

export default function App() {
  //HashRouter should be the top-level element
  //contents of Switch block changes based on URL
  //Had to change BrowserRouter to HashRouter:
  //https://levelup.gitconnected.com/deploying-a-create-react-app-with-routing-to-github-pages-f386b6ce84c2
  return (
    <HashRouter basename='/'>
        <Header />
        <Switch>
          <Route path='/howto'>
              <HowTo />
          </Route>
          <Route exact path='/'>
              <Main />
          </Route>
        </Switch>
    </HashRouter>
  );
}
