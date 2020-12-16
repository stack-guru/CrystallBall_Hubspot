import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import './Scripts';
import Main from './Main';
import { ToastContainer } from 'react-toastify';

function UI() {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Main} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default UI;


if (document.getElementById('ui')) {
  ReactDOM.render(<UI />, document.getElementById('ui'));
}
