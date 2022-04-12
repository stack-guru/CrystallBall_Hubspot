import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import './Main.css';
import './Responsiveness.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import 'animate.css';

import './Sidebarjs.js';

import Main from './Main';

function UI() {
  return (
    <BrowserRouter>
      <React.StrictMode>
        <Switch>
          <Route component={Main} />
        </Switch>
      </React.StrictMode>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default UI;


if (document.getElementById('ui')) {
  ReactDOM.render(<UI />, document.getElementById('ui'));
}
