//@flow
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import type {CountersPageStateType} from './counters-page';
import countersPage from './counters-page';
import type {EventsPageStateType} from "./events-page";
import eventsPage from './events-page';

export type Action = {
    type: string,
    data: Object,
}

export type RootState = {
    countersPage: CountersPageStateType,
    eventsPage: EventsPageStateType
}

export default combineReducers({
    routing,
    countersPage,
    eventsPage
});