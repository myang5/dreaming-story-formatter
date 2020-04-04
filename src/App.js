import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import HowTo from './HowTo.js';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';

export default function App() {
  //BrowserRouter should be the top-level element
  //contents of Switch block changes based on URL
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
