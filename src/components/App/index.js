import React from 'react';
import './App.scss';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../../history';

import Search from '../../containers/Search';
import Results from '../../containers/Results';
import Experiment from '../../containers/Experiment';
import Dashboard from '../../containers/Dashboard';
import Downloads from '../../containers/Downloads';
import ViewDownload from '../../containers/Downloads/ViewDownload';
import Layout from '../Layout';

const App = () => {
  return (
    <div>
      <Router history={history}>
        <Layout>
          <Switch>
            <Route exact path="/" component={Search} />
            <Route path="/results" component={Results} />
            <Route path="/experiments/:id" component={Experiment} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/download/:id" component={ViewDownload} />
            <Route path="/download" component={Downloads} />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
