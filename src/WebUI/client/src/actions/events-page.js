import {ALLOW_UPDATING, CLEAR_EVENTS, FETCH_FAIL, FETCH_OK, FETCHING} from '../constants/evetns-page';
import {api} from '../api';


export function clearEvents() {
    return async (dispatch) => {
        dispatch({type: CLEAR_EVENTS});
    }
}

export function allowUpdating(allow = true) {
    return async (dispatch, getState) => {
        if (getState().eventsPage.config.allowUpdating !== allow) {
            dispatch({type: ALLOW_UPDATING, payload: {allowUpdating: allow}});
        }
    }
}

export function fetchNextEvents() {
    return async (dispatch, getState) => {
        let {fetching, hasMore, items} = getState().eventsPage.events;

        if (fetching || !hasMore) return;

        dispatch({type: FETCHING});

        try {
            let fromDate = items.length && items[items.length - 1].date,
                events = await api('events.get', {fromDate, count: 30});

            dispatch({
                type: FETCH_OK,
                payload: {...events, pushTo: 1}
            });
        } catch (e) {
            dispatch({type: FETCH_FAIL});
        }
    }
}


export function fetchNewEvents() {
    return async (dispatch, getState) => {
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
                    payload: {
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





