import {UPDATING, UPDATE_OK, UPDATE_FAIL, s, m, h, d} from '../constants/counters-page';
import {api} from '../api';

export function updateCounters(){
	return async (dispatch, getState) => {
		if(getState().countersPage.items.fetching)return;

		dispatch({type: UPDATING});

		try {
			let now = Math.floor(Date.now()/1000),
				{groupInterval, showCount} = getState().countersPage.config,
				lastGroup = now - now%groupInterval,
				toDate = lastGroup - groupInterval*(showCount-1),
				counters = await api('counters.get', {interval: groupInterval, toDate});

			dispatch({
				type: UPDATE_OK,
				payload: {data: counters}
			});
		}catch(e){
			dispatch({type: UPDATE_FAIL});
		}
	}
}




