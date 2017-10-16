import {UPDATING, UPDATE_OK, UPDATE_FAIL, s, m, h, d} from '../constants/counters-page';
import {api} from '../api';

export function updateCounters(){
	return async (dispatch, getState) => {
		if(getState().countersPage.items.fetching)return;

		dispatch({type: UPDATING});

		try {
			let counters = await api('counters.get');
			dispatch({
				type: UPDATE_OK,
				payload: {data: counters}
			});
		}catch(e){
			dispatch({type: UPDATE_FAIL});
		}
	}
}




