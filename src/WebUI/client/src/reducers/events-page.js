import {FETCHING, FETCH_OK, FETCH_FAIL} from '../constants/evetns-page';


const initialState = {
	events: {
		items: [],
		hasMore: true,
		fetching: false,
		error: false,
	}
};


export default function countersPageReducer(state = initialState, action){
	switch (action.type){
		case FETCHING:
			return {
				events: {
					...state.events,
					fetching: true,
					error: false,
				},
			};

		case FETCH_FAIL:
			return {
				events: {
					...state.events,
					fetching: false,
					error: true,
				}
			};

		case FETCH_OK:{
			let {items, hasMore, pushTo} = action.payload,
				oldItems = state.events.items;

			switch (pushTo){
				case -1:
					items = items.concat(oldItems); break;
				case 1:
					//items = oldItems.concat(items); break;
					Array.prototype.push.apply(oldItems, items); break;
			}

			return {
				...state,
				events: {
					...state.events,
					items: oldItems,
					hasMore,
					fetching: false,
					error: false,
				}
			};
		}


		default: return state;
	}
}