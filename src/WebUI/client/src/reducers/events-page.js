//@flow

import {ALLOW_UPDATING, CLEAR_EVENTS, FETCH_FAIL, FETCH_OK, FETCHING} from '../constants/evetns-page';
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
        case FETCHING:
            return {
                ...state,
                events: {
                    ...state.events,
                    fetching: true,
                    error: null,
                },
            };

        case FETCH_FAIL:
            return {
                ...state,
                events: {
                    ...state.events,
                    fetching: false,
                    error: "Events fetching failed",
                }
            };

        case FETCH_OK: {
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

        default:
            return state;
    }
}