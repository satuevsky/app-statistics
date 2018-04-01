//@flow

import {
    ALLOW_UPDATING,
    CLEAR_EVENTS,
    EVENTS_FETCH_FAIL,
    EVENTS_FETCH_OK,
    EVENTS_FETCHING,
    EVENTS_SET_FILTER,
} from '../constants/evetns-page';
import type {Action} from "./index";


export type EventsPageStateType = {
    events: {
        items: Object[],
        hasMore: boolean,
        fetching: boolean,
        error: any,
    },
    config: {
        allowUpdating: boolean,
        filter: {
            fromDate: ?number,
            toDate: ?number,
            eventNames: ?(string[]),
        }
    }
}

const initialState: EventsPageStateType = {
    events: {
        items: [],
        hasMore: true,
        fetching: false,
        error: null,
    },
    config: {
        allowUpdating: true,
        filter: {
            eventNames: null,
            fromDate: null,
            toDate: null,
        },
    }
};


export default function countersPageReducer(state: EventsPageStateType = initialState, action: Action) {
    switch (action.type) {
        case EVENTS_FETCHING:
            return {
                ...state,
                events: {
                    ...state.events,
                    fetching: true,
                    error: null,
                },
            };

        case EVENTS_FETCH_FAIL:
            return {
                ...state,
                events: {
                    ...state.events,
                    fetching: false,
                    error: "Events fetching failed",
                }
            };

        case EVENTS_FETCH_OK: {
            let {items, hasMore, pushTo} = action.data,
                oldItems = state.events.items;

            switch (pushTo) {
                case -1:
                    items = items.concat(oldItems);
                    break;
                case 1:
                    items = oldItems.concat(items);
                    break;
                //Array.prototype.push.apply(oldItems, items); break;
            }

            return {
                ...state,
                events: {
                    ...state.events,
                    items,
                    hasMore,
                    fetching: false,
                    error: null,
                }
            };
        }

        case CLEAR_EVENTS:
            return {
                ...state,
                events: {
                    ...state.events,
                    items: [],
                    hasMore: true,
                    fetching: false,
                    error: false,
                }
            };

        case ALLOW_UPDATING:
            return {
                ...state,
                config: {
                    ...state.config,
                    allowUpdating: action.data.allowUpdating
                }
            };

        case EVENTS_SET_FILTER:
            return {
                ...state,
                config: {
                    ...state.config,
                    filter: {
                        toDate: action.data.toDate,
                        fromDate: action.data.fromDate,
                        eventNames: action.data.eventNames,
                    },
                    events: {
                        items: [],
                        fetching: false,
                        hasMore: true,
                        error: null
                    },
                }
            };

        default:
            return state;
    }
}