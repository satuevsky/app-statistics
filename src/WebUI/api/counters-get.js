let Method = require('vkl-api').Method,
	errors = require('vkl-api').defaultErrors;

module.exports = new Method('counters.get', {params: {
		//seconds to group counters.
		interval: {type: Number, default: 3600, minValue: 1},
		//get counters to this date (timestamp/1000).
		toDate: Number
	}},
	async (req, res) => {
		try{
			let counters = await req.context.statistics.getCounters({
				groupByInterval: req.params.interval * 1000,
				toDate: req.params.toDate * 1000,
			});
			res.ok(counters);
		}catch (e){
			res.error(errors.unknownError);
		}
	});