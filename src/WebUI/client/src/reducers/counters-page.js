import {UPDATING, UPDATE_OK, UPDATE_FAIL, h} from '../constants/counters-page';


const initialState = {
	items: {
		counters: {}, // {["counter-name"]: {maxValue: value, values: {[time]: value}, ...}, ...}
		counterNames: [],
		fetching: false,
		error: false,
	},
	config: {
		groupInterval: h,
		showCount: 7,
	}
};


export default function countersPageReducer(state = initialState, action){
	switch (action.type){
		case UPDATING:
			return {
				...state,
				items: {
					...state.items,
					fetching: true,
				}
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
			let counterNames = [],
				data = action.payload.data, // [{time: Number, values: {["counter-name"]: value, ...}}]
				counters = {};

			data.forEach(c => {
				Object.keys(c.values).forEach(cn => {
					let counter = counters[cn];
					if(!counter){
						counterNames.push(cn);
						counter = counters[cn] = {maxValue: 0, values: {}};
					}
					const value = c.values[cn];
					counter.values[c.time] = value;
					if(value > counter.maxValue)counter.maxValue = value;
				});
			});

			return {
				...state,
				items: {
					...state.items,
					fetching: false,
					error: false,
					counters,
					counterNames,
				}
			};
		}


		default: return state;
	}
}