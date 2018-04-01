//@flow
import {
    ALLOW_UPDATING,
    CLEAR_EVENTS,
    EVENTS_FETCH_FAIL,
    EVENTS_FETCH_OK,
    EVENTS_FETCHING,
    EVENTS_SET_FILTER
} from '../constants/evetns-page';
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
            dispatch({
                type: ALLOW_UPDATING,
                data: {allowUpdating: allow}
            });
        }
    }
}

export type EventsSetFilterParams = { fromDate: number, toDate: number, eventNames: string[] }

export function setFilter(params?: EventsSetFilterParams) {
    return async (dispatch: *) => {
        dispatch({
            type: EVENTS_SET_FILTER,
            data: params || {},
        });
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

        dispatch({type: EVENTS_FETCHING});

        let params: Object = {count: 30};
        if (fromDate) params.from_date = fromDate;
        if (toDate) params.to_date = toDate;
        if (eventNames) params.event_names = eventNames.join(",");

        try {
            events = await api('events.get', params);
            dispatch({
                type: EVENTS_FETCH_OK,
                data: {...events, pushTo: 1}
            });
        } catch (e) {
            dispatch({type: EVENTS_FETCH_FAIL});
        }
    }
}


export function fetchNewEvents() {
    return async (dispatch: *, getState: () => RootState) => {
        let {config} = getState().eventsPage,
            {eventNames, toDate, fromDate} = config.filter;

        if (!config.allowUpdating || fromDate) return;

        try {
            let items = getState().eventsPage.events.items,
                toDate = items.length && items[0].date,
                newEvents = await api('events.get', {
                    count: 100,
                    to_date: toDate,
                    event_names: eventNames && eventNames.join(",")
                });

            let {events, config} = getState().eventsPage;

            if (config.allowUpdating && toDate === (events.items.length && events.items[0].date)) {
                dispatch({
                    type: EVENTS_FETCH_OK,
                    data: {
                        ...newEvents,
                        pushTo: newEvents.items.length < 100 ? -1 : 0
                    }
                });
            }
        } catch (e) {
            dispatch({type: EVENTS_FETCH_FAIL});
        }
    }
}





