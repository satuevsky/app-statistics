//@flow

import {UPDATING, UPDATE_OK, UPDATE_FAIL, h} from '../constants/counters-page';
import type {Action} from "./index";


type CountersPageState = {
    items: CountersPageItems,
    config: CountersPageConfig,
};

export type CountersPageItems = {
    counters: ?CountersType,
    counterNames: string[],
    counterTimes: number[],
    lastGroupTime: number,
    fetching: boolean,
    error: any,
};

export type CountersType = {
    [counterName: string]: CounterType
}

type CounterType = {
    maxValue: number,
    values: {[time: number]: number}
}


export type CountersPageConfig = {
    groupInterval: CountersPageGroupIntervalType,
    showCount: number,
};

export type CountersPageGroupIntervalType = "m"|"h"|"D"|"W"|"M"|"Y";



const initialState: CountersPageState = {
	items: {
		counters: null, // {["counter-name"]: {maxValue: value, values: {[time]: value}, ...}, ...}
		counterNames: [],
        counterTimes: [],
		lastGroupTime: 0,
		fetching: false,
		error: false,
	},
	config: {
		groupInterval: "h",
		showCount: 7,
	}
};


export default function countersPageReducer(state: CountersPageState = initialState, action: Action){
	switch (action.type){
		case UPDATING:
			return {
				...state,
				items: {
					...state.items,
					counters: action.data.isNewConfig ? null : state.items.counters,
                    counterNames: action.data.isNewConfig ? [] : state.items.counterNames,
                    counterTimes: action.data.isNewConfig ? [] : state.items.counterTimes,
					lastGroupTime: action.data.isNewConfig ? 0 : state.items.lastGroupTime,
					fetching: true,
					error: false,
				},
				config: action.data.config
			};

		case UPDATE_FAIL:
			return {
				...state,
				items: {
					...state.items,
					fetching: false,
					error: true,
				}
			};

		case UPDATE_OK:{
			let {counterNames, counterTimes, lastGroupTime} = state.items,
                counters: CountersType = state.items.counters || {},
                response = action.data.response; // [{time: Number, values: {["counter-name"]: value, ...}}]

            for(let i = response.length - 1; i >= 0; i--){
                let c = response[i];
                Object.keys(c.values).forEach(cn => {
                    let counter = counters[cn];

                    if(!counter){
                        counterNames.push(cn);
                        counterNames.sort();
                        counter = counters[cn] = {maxValue: 0, values: {}};
                    }
                    const value = c.values[cn];
                    counter.values[c.time] = value;
                    if(value > counter.maxValue)counter.maxValue = value;
                });
                if(c.time > lastGroupTime){
                    counterTimes.unshift(c.time);
                }
            }

			return {
				...state,
				items: {
					...state.items,
					fetching: false,
					error: false,
					counters,
					counterNames,
                    counterTimes,
					lastGroupTime: response.length ? response[0].time : state.items.lastGroupTime
				}
			};
		}


		default: return state;
	}
}