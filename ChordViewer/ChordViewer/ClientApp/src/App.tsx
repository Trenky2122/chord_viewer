import React, { Component } from 'react';
import { Route } from 'react-router';

import './custom.css'
import {BrowserRouter} from "react-router-dom";
import Home from "./components/Home";
import {NavMenu} from "./components/NavMenu";

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <div className={"wrapper"}>
            <NavMenu />
            <BrowserRouter>
                <Route path={"/"} component={Home} />
            </BrowserRouter>
        </div>
    );
  }
}
