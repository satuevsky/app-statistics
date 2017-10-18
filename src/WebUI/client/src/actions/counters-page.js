import {UPDATING, UPDATE_OK, UPDATE_FAIL, SET_CONFIG} from '../constants/counters-page';
import {api} from '../api';

export function updateCounters({groupInterval, showCount} = {}){
	return async (dispatch, getState) => {
		let {config, items} = getState().countersPage,
			isNewConfig = (groupInterval && groupInterval !== config.groupInterval) || (showCount && showCount !== config.showCount);

		if(isNewConfig || !items.fetching){
			if(isNewConfig)
				config = {
					groupInterval: groupInterval || config.groupInterval,
					showCount: showCount || config.showCount,
				};

			dispatch({type: UPDATING, payload: {config, isNewConfig}});

			try {
				let toDate = getState().countersPage.items.lastGroupTime;

				if(!toDate){
					let now = Math.floor(Date.now()/1000),
						{groupInterval, showCount} = config,
						lastGroupTime = now - now % groupInterval;
					toDate = lastGroupTime - groupInterval*(showCount-1);
				}

				let counters = await api('counters.get', {interval: config.groupInterval, toDate});

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




