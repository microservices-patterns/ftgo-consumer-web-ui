import React, { lazy, Suspense } from 'react';
import { Loading, LoadingSpinner } from '../../elements/Loading';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { routePaths } from './routePaths';


const LandingPage = lazy(() => import(/* webpackChunkName: "landing" */ '../LandingPage'));
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '../LoginPage'));
const RestaurantListPage = lazy(() => import(/* webpackChunkName: "places" */ '../RestaurantListPage'));
const RestaurantPage = lazy(() => import(/* webpackChunkName: "place" */ '../RestaurantPage'));
const CheckoutPage = lazy(() => import(/* webpackChunkName: "checkout" */ '../CheckoutPage'));
const ThankYouPage = lazy(() => import(/* webpackChunkName: "thankyou" */ '../ThankYouPage'));

const repackWithComponentRender = ([ path, Component ]) => [ path, ({
  path,
  render: props => <Component { ...props } />
}) ];

const routesMap = new Map([
  [ routePaths.landing, LandingPage ],
  [ routePaths.restaurants, RestaurantListPage ],
  [ routePaths.restaurant, RestaurantPage ],
  [ routePaths.checkout, CheckoutPage ],
  [ routePaths.thankyou, ThankYouPage ],
  [ routePaths.login, LoginPage ]
].map(repackWithComponentRender));

const routes = [
  routePaths.landing,
  routePaths.login,
  routePaths.restaurant,
  routePaths.restaurants,
  routePaths.checkout,
  routePaths.thankyou,
].filter(Boolean)
  .map(item => typeof item === 'string' ?
    <Route key={ item } path={ item } { ...routesMap.get(item) } /> :
    item);


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
        No match for <code>{ location.pathname }</code>
      </h3>
    </div>
  );
}
