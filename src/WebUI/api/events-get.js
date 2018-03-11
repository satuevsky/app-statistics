let Method = require('vkl-api').Method,
    errors = require('vkl-api').defaultErrors;

module.exports = new Method('events.get', {
        params: {
            count: {type: Number, minVale: 1, maxValue: 100, default: 30},
            fromDate: Number,
            toDate: Number,
        }
    },
    async (req, res) => {
        try {
            const {count, fromDate, toDate} = req.params;
            let events = await req.context.statistics.getEvents({
                count: count + 1,
                fromDate,
                toDate,
            });
            const hasMore = events.length === count + 1;
            if (hasMore) {
                events.pop();
            }
            res.ok({items: events, hasMore});
        } catch (e) {
            res.error(errors.unknownError);
        }
    });
