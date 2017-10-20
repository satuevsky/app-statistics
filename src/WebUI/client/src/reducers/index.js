import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import countersPage from './counters-page';
import eventsPage from './events-page';

export default combineReducers({
	routing,
	countersPage,
	eventsPage
});