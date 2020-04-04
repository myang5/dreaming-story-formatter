import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import HowTo from './HowTo.js';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

export default function App() {
  //BrowserRouter should be the top-level element
  //contents of Switch block changes based on URL
  return (
    <BrowserRouter>
        <Header />
        <Switch>
          <Route exact={true} path='/'>
              <Main />
          </Route>
          <Route exact={true} path='/howto'>
              <HowTo />
          </Route>
        </Switch>
    </BrowserRouter>
  );
}
