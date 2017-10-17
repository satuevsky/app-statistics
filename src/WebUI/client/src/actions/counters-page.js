import {UPDATING, UPDATE_OK, UPDATE_FAIL, SET_CONFIG} from '../constants/counters-page';
import {api} from '../api';

export function updateCounters({groupInterval, showCount} = {}){
	return async (dispatch, getState) => {
		let {config, items} = getState().countersPage;

		if(
			(groupInterval && groupInterval !== config.groupInterval) ||
			(showCount && showCount !== config.showCount) ||
			!items.fetching
		){
			config = {
				groupInterval: groupInterval || config.groupInterval,
				showCount: showCount || config.showCount,
			};
			dispatch({type: UPDATING, payload: {config}});

			try {
				let now = Math.floor(Date.now()/1000),
					{groupInterval, showCount} = getState().countersPage.config,
					lastGroup = now - now%groupInterval,
					toDate = lastGroup - groupInterval*(showCount-1),
					counters = await api('counters.get', {interval: groupInterval, toDate});

				if(getState().countersPage.config === config)
					dispatch({
						type: UPDATE_OK,
						payload: {data: counters}
					});
			}catch(e){
				if(getState().countersPage.config === config)
					dispatch({type: UPDATE_FAIL});
			}
		}
	}
}




