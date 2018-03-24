let Method = require('vkl-api').Method,
    errors = require('vkl-api').defaultErrors;

module.exports = new Method('events.get', {
        params: {
            count: {type: Number, minVale: 1, maxValue: 100, default: 30},
            from_date: Number,
            to_date: Number,
            event_names: String,
        }
    },
    async (req, res) => {
        try {
            const {count, from_date, to_date, event_names} = req.params;
            let events = await req.context.statistics.getEvents({
                count: count + 1,
                fromDate: from_date,
                toDate: to_date,
                eventNames: event_names ? event_names.split(',').map(eventName => eventName.trim()) : null
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
