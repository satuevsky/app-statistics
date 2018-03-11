import {ALLOW_UPDATING, CLEAR_EVENTS, FETCH_FAIL, FETCH_OK, FETCHING} from '../constants/evetns-page';


const initialState = {
    events: {
        items: [],
        hasMore: true,
        fetching: false,
        error: false,
    },
    config: {
        allowUpdating: true,
        filter: {
            eventName: false,
            fromDate: false,
            toDate: false,
        },
    }
};


export default function countersPageReducer(state = initialState, action) {
    switch (action.type) {
        case FETCHING:
            return {
                ...state,
                events: {
                    ...state.events,
                    fetching: true,
                    error: false,
                },
            };

        case FETCH_FAIL:
            return {
                ...state,
                events: {
                    ...state.events,
                    fetching: false,
                    error: true,
                }
            };

        case FETCH_OK: {
            let {items, hasMore, pushTo} = action.payload,
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
                    error: false,
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
                    allowUpdating: action.payload.allowUpdating
                }
            };

        default:
            return state;
    }
}