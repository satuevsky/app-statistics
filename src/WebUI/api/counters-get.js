let Method = require('vkl-api').Method,
    errors = require('vkl-api').defaultErrors;

module.exports = new Method('counters.get', {
        params: {
            //group interval char.
            interval: {type: String},
            //get groups to this date inclusive
            to_date: Number,
            //get groups count limit
            count: Number,
            need_groups: Boolean,
        }
    },
    async (req, res) => {
        try {
            let counters = await req.context.statistics.getCounters({
                groupByInterval: req.params.interval,
                toDate: req.params.to_date ? new Date(req.params.to_date * 1000) : null,
                groupsCount: req.params.count,
                }),
                result = {counters};

            if (req.params.need_groups) {
                result.counterGroups = req.context.counterGroups;
            }

            res.ok(result);
        } catch (e) {
            res.error(errors.unknownError);
        }
    });