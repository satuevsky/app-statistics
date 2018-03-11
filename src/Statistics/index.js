const
    CountersTracker = require('./CountersTracker'),
    EventsTrackers = require('./EventsTracker'),
    s = 1000,
    m = s * 60,
    h = m * 60;


class Statistics {
    /**
     * @param {Object} db - Mongo database connection
     * @param {string} [countersGroupTimeLapse="h"] - Interval for grouping counters. Can be one of "h", "d", "w", "m", "y".
     * @param {Number} [countersAutoFlushInterval=10000] - Interval between saving counters to db. By default 10 seconds.
     * @param {Number} [eventsExpire] - Number of seconds during which the event will be stored. By default, events will not be deleted.
     * @param {Boolean} [listenConsole=false] - If true then will be track console events. By default false.
     */
    constructor({db, countersAutoFlushInterval = 10000, countersGroupTimeLapse = "h", eventsExpire, listenConsole = false}) {
        this.countersTracker = new CountersTracker({
            db,
            autoFlushInterval: countersAutoFlushInterval,
            groupTimeInterval: countersGroupTimeLapse
        });
        this.eventsTracker = new EventsTrackers({
            db,
            expire: eventsExpire
        });

        if (listenConsole) {
            let self = this,
                {error, warn, log} = console;

            console.error = hookConsole(error, "console_error");
            console.warn = hookConsole(warn, "console_warn");
            console.log = hookConsole(log, "console_log");

            function hookConsole(method, eventName) {
                return function () {
                    self.track({eventName, data: arguments});
                    method.apply(console, arguments);
                }
            }
        }
    }

    track({eventName, uid, data, toCountersOnly}) {
        let params = arguments[0];
        this.countersTracker.trackEvent(params);
        if (!toCountersOnly) {
            this.eventsTracker.trackEvent(params);
        }
    }

    /**
     * Get counters from database
     * @param {string} [groupByInterval] - For grouping counters by time. One hour by default.
     * @param {Date} [toDate] - Returns groups before the specified date, but no more than 'groupsLimit'.
     * @param {Number} [groupsCount] - For returns no more than the specified number of groups.
     * @return {Promise.<[{date: Number, counters: Object}]>}
     */
    getCounters({groupByInterval, groupsCount, toDate} = {}) {
        return this.countersTracker.getCounters({groupByInterval, groupsCount, toDate});
    }

    /**
     * Get events from db
     * @param {Number} [count=30]
     * @param {Number} fromDate
     * @param {Number} toDate
     * @param {String} eventsFilter
     * @return {Promise.<[{en: String, uid: String, data: *, date: Date}]>}
     */
    getEvents({count = 30, fromDate, toDate, eventsFilter} = {}) {
        return this.eventsTracker.getEvents({count, fromDate, toDate, eventsFilter});
    }
}

module.exports = Statistics;