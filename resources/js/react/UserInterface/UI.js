import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import * as Sentry from "@sentry/react";

import './Main.css';
import './Responsiveness.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import 'animate.css';
import 'react-circular-progressbar/dist/styles.css';

import './Sidebarjs.js';

import Main from './Main';


Sentry.init({
  dsn: process.env.MIX_SENTRY_REACT_DSN,
  environment: process.env.MIX_SENTRY_REACT_ENVIRONMENT,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: process.env.MIX_SENTRY_REACT_TRACES_SAMPLE_RATE,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
