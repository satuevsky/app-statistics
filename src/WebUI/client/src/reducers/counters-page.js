//@flow

import {UPDATE_FAIL, UPDATE_OK, UPDATING} from '../constants/counters-page';
import type {Action} from "./index";


export type CountersPageState = {
    items: CountersPageItems,
    config: CountersPageConfig,
};

export type CountersPageItems = {
    _countersWithGroups: { [counterName: string]: true },
    counters: ?CountersType,
    counterGroups: CountersPageGroupType[],
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
    values: { [time: number]: number }
}

export type CountersPageGroupType = CounterType & {
    name: string,
    items: string[],
}

export type CountersPageConfig = {
    groupInterval: CountersPageGroupIntervalType,
    showCount: number,
};

export type CountersPageGroupIntervalType = "m" | "h" | "D" | "W" | "M" | "Y";


const initialState: CountersPageState = {
    items: {
        _countersWithGroups: {},
        counters: null,
        counterGroups: [{
            name: "__without_groups",
            items: [],
            maxValue: 0,
            values: {},
        }],
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


export default function countersPageReducer(state: CountersPageState = initialState, action: Action) {
    switch (action.type) {

        // Started downloading counters
        case UPDATING:
            return {
                ...state,
                items: {
                    ...state.items,
                    error: false,
                    fetching: true,
                    counters: action.data.isNewConfig ? null : state.items.counters,
                    counterTimes: action.data.isNewConfig ? [] : state.items.counterTimes,
                    lastGroupTime: action.data.isNewConfig ? 0 : state.items.lastGroupTime,
                },
                config: action.data.config
            };

        // Downloading counters failed
        case UPDATE_FAIL:
            return {
                ...state,
                items: {
                    ...state.items,
                    error: true,
                    fetching: false,
                }
            };

        // Downloading counters successfully completed
        case UPDATE_OK: {
            let {counterGroups, counterTimes, lastGroupTime, _countersWithGroups} = state.items,
                counters: CountersType = state.items.counters || {},
                response: {
                    counterGroups: { name: string, items: string[] }[],
                    counters: { time: number, values: { [counterName: string]: number } }[],
                } = action.data.response,
                withoutGroup: CountersPageGroupType = counterGroups[counterGroups.length - 1];

            if (response.counterGroups) {
                _countersWithGroups = {};
                withoutGroup.items = [];
                let groups = response.counterGroups.map(group => {
                    group.items.forEach(counterName => _countersWithGroups[counterName] = true);
                    return {
                        ...group,
                        maxValue: 0,
                        values: {},
                    }
                });
                counterGroups = [
                    ...groups,
                    withoutGroup
                ]
            }

            for (let i = response.counters.length - 1; i >= 0; i--) {
                let currentCounters = response.counters[i];

                Object.keys(currentCounters.values).forEach(counterName => {
                    let counter = counters[counterName];
                    if (!counter) {
                        if (!_countersWithGroups[counterName]) {
                            withoutGroup.items.push(counterName);
                        }
                        counter = counters[counterName] = {maxValue: 0, values: {}};
                    }
                    let value = currentCounters.values[counterName];
                    counter.values[currentCounters.time] = value;
                    if (value > counter.maxValue) counter.maxValue = value;
                });

                counterGroups.forEach((counterGroup: CountersPageGroupType) => {
                    if (counterGroup === withoutGroup) return;
                    let value = 0;
                    counterGroup.items.forEach(counterName => {
                        let counter = counters[counterName];
                        value += counter ? (counter.values[currentCounters.time] || 0) : 0;
                    });
                    counterGroup.values[currentCounters.time] = value;
                    counterGroup.maxValue = Math.max(counterGroup.maxValue, value);
                });

                if (currentCounters.time > lastGroupTime) {
                    counterTimes.unshift(currentCounters.time);
                }
            }

            return {
                ...state,
                items: {
                    ...state.items,
                    error: false,
                    fetching: false,
                    counters,
                    counterGroups,
                    counterTimes,
                    _countersWithGroups,
                    lastGroupTime: response.counters.length ? response.counters[0].time : state.items.lastGroupTime
                }
            };
        }

        default:
            return state;
    }
}