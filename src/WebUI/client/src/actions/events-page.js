import {FETCHING, FETCH_FAIL, FETCH_OK} from '../constants/evetns-page';
import {api} from '../api';

export function fetchNextEvents(){
	return async (dispatch, getState) => {
		let {fetching, hasMore, items} = getState().eventsPage.events;

		if(fetching || !hasMore)return;

		dispatch({type: FETCHING});

		try {
			let fromDate = items.length && items[items.length - 1].date,
				events = await api('events.get', {fromDate, count: 30});

			dispatch({
				type: FETCH_OK,
				payload: {...events, pushTo: 1}
			});
		}catch(e){
			dispatch({type: FETCH_FAIL});
		}
	}
}




