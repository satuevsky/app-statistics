//@flow
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import type {CountersPageState} from './counters-page';
import countersPage from './counters-page';
import eventsPage from './events-page';

export type Action = {
    type: string,
    data: Object,
}

export type State = {
    countersPage: CountersPageState
}

export default combineReducers({
    routing,
    countersPage,
    eventsPage
});