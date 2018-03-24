//@flow
import {ALLOW_UPDATING, CLEAR_EVENTS, FETCH_FAIL, FETCH_OK, FETCHING} from '../constants/evetns-page';
import {api} from '../api';
import type {EventsPageStateType} from "../reducers/events-page";
import type {RootState} from "../reducers";


export function clearEvents() {
    return async (dispatch: *) => {
        dispatch({type: CLEAR_EVENTS});
    }
}

export function allowUpdating(allow: boolean = true) {
    return async (dispatch: *, getState: () => RootState) => {
        if (getState().eventsPage.config.allowUpdating !== allow) {
            dispatch({type: ALLOW_UPDATING, payload: {allowUpdating: allow}});
        }
    }
}

export function fetchNextEvents() {
    return async (dispatch: *, getState: () => RootState) => {
        let {events, config}: EventsPageStateType = getState().eventsPage,
            {fetching, hasMore, items} = events,
            {fromDate, toDate, eventNames} = config.filter;

        if (items.length) {
            fromDate = items[items.length - 1].date;
        }

        if (fetching || !hasMore) return;
        if (toDate != null && fromDate != null && fromDate < toDate) return;

        dispatch({type: FETCHING});

        try {
            events = await api('events.get', {fromDate, count: 30});
            dispatch({
                type: FETCH_OK,
                data: {...events, pushTo: 1}
            });
        } catch (e) {
            dispatch({type: FETCH_FAIL});
        }
    }
}


export function fetchNewEvents() {
    return async (dispatch: *, getState: () => RootState) => {
        let {config} = getState().eventsPage;

        if (!config.allowUpdating) return;

        try {
            let items = getState().eventsPage.events.items,
                toDate = items.length && items[0].date,
                newEvents = await api('events.get', {toDate, count: 100});

            let {events, config} = getState().eventsPage;

            if (config.allowUpdating && toDate === (events.items.length && events.items[0].date)) {
                dispatch({
                    type: FETCH_OK,
                    data: {
                        ...newEvents,
                        pushTo: newEvents.items.length < 100 ? -1 : 0
                    }
                });
            }
        } catch (e) {
            dispatch({type: FETCH_FAIL});
        }
    }
}





