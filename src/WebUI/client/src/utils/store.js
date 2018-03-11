import {applyMiddleware, createStore} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import history from './history';

const routesMiddleware = routerMiddleware(history);

const store = window.store = createStore(
    reducers,
    {},
    applyMiddleware(thunk, routesMiddleware)
);

export default store;