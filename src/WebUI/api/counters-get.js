let Method = require('vkl-api').Method,
	errors = require('vkl-api').defaultErrors;

module.exports = new Method('counters.get', {params: {
		//group interval char.
		group_interval: {type: String},
		//get groups to this date inclusive
		to_date: Number,
		//get groups count limit
		count: Number,
	}},
	async (req, res) => {
		try{
			let counters = await req.context.statistics.getCounters({
				groupByInterval: req.params.group_interval,
				toDate: req.params.to_date ? new Date(req.params.to_date * 1000) : null,
				groupsCount: req.params.count,
			});
			res.ok(counters);
		}catch (e){
			res.error(errors.unknownError);
		}
	});