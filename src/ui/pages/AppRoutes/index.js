import React, { lazy, Suspense } from 'react';
import { Loading, LoadingSpinner } from '../../elements/Loading';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { routePaths } from './routePaths';


const LandingPage = lazy(() => import(/* webpackChunkName: "landing" */ '../LandingPage'));
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../LoginPage'));

const routesMap = [
  [ routePaths.landing, LandingPage ],
  [ routePaths.login, LoginPage ],
].reduce((map, [ path, Component ]) => map.set(path, ({
  path,
  render: props => <Component { ...props } />
})), new Map());

const routes = [
  routePaths.landing,
  routePaths.login
].filter(Boolean)
  .map(item => typeof item === 'string' ? <Route key={ item } path={ item } { ...routesMap.get(item) } /> : item);


function Routes() {
  return <Switch>
    <Redirect from="/index.html" to={ routePaths.landing } />
    { routes }
    <Redirect to={ routePaths.landing } />
    <Route path="*">
      <NoMatch />
    </Route>
  </Switch>;
}

export function getAppsRoutes() {
  return <Suspense fallback={ <Loading><LoadingSpinner /></Loading> }><Routes /></Suspense>;
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}
