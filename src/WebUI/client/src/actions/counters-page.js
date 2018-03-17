import {UPDATE_FAIL, UPDATE_OK, UPDATING} from '../constants/counters-page';
import {api} from '../api';

export function updateCounters({groupInterval, showCount} = {}) {
    return async (dispatch, getState) => {
        let {config, items} = getState().countersPage,
            isNewConfig =
                (groupInterval && groupInterval !== config.groupInterval) ||
                (showCount && showCount !== config.showCount);

        if (isNewConfig || !items.fetching) {
            if (isNewConfig)
                config = {
                    groupInterval: groupInterval || config.groupInterval,
                    showCount: showCount || config.showCount,
                };

            dispatch({type: UPDATING, data: {config, isNewConfig}});

            try {
                let params = {interval: config.groupInterval},
                    toDate = getState().countersPage.items.lastGroupTime;

                if (!toDate) {
                    params.count = 7;
                    params.need_groups = true;
                } else {
                    params.to_date = toDate;
                }

                let response = await api('counters.get', params);

                if (getState().countersPage.config === config) {
                    dispatch({
                        type: UPDATE_OK,
                        data: {response}
                    });
                }
            } catch (e) {
                if (getState().countersPage.config === config) {
                    dispatch({type: UPDATE_FAIL});
                }
            }
        }
    }
}




