let {getGroupTime, normalizeGroupTimeInterval} = require("./utils");

const s = 1000,
    m = s * 60,
    h = m * 60;

function setNextAutoFlushTimeout(self) {
    let nextGroupTime = getGroupTime(self.groupTimeInterval, {groupOffset: +1}),
        nextAutoFlushTimeout = Math.min(nextGroupTime - Date.now(), self.autoFlushInterval);

    setTimeout(() => {
        self.saveCounters();
        setNextAutoFlushTimeout(self);
    }, nextAutoFlushTimeout)
}

function encodeEventName(eventName) {
    return eventName.replace(/(\.)/g, "&2e").replace(/^(\$)/, "&24")
}

function decodeEventName(eventName) {
    return eventName.replace(/(&2e)/g, ".").replace(/^(&24)/, "$")
}


class CountersTracker {
    constructor({db, groupTimeInterval, autoFlushInterval = 10 * s}) {
        this.countersCollection = db.collection('app_statistics_counters');
        this.groupTimeInterval = normalizeGroupTimeInterval(groupTimeInterval);
        this.autoFlushInterval = autoFlushInterval;
        this.currentCounters = {
            counters: {},
            hasNew: false,
            time: getGroupTime(this.groupTimeInterval),
        };

        setNextAutoFlushTimeout(this);
    }

    /**
     * Track new event
     * @param {String} eventName - Event name
     */
    trackEvent({eventName}) {
        let currentValue = this.currentCounters.counters[eventName] || 0;
        this.currentCounters.counters[eventName] = currentValue + 1;
        this.currentCounters.hasNew = true;
    }

    /**
     * Get counters
     * @param {string} groupByInterval
     * @param {number} [groupsCount]
     * @param {Date} [toDate]
     * @return {Promise<Array>}
     */
    async getCounters({groupByInterval, groupsCount, toDate}) {
        groupByInterval = normalizeGroupTimeInterval(groupByInterval);
        groupsCount = -(groupsCount || 7);
        toDate = toDate || getGroupTime(groupByInterval, {groupOffset: groupsCount + 1});

        let docs = await this.countersCollection
                .find({_id: {$gte: new Date(toDate)}})
                .sort({_id: -1})
                .toArray(),
            grouped = [],
            lastGroup = {
                time: Math.floor(getGroupTime(groupByInterval) / 1000),
                values: {},
            },
            currentGroupIndex = 0;

        //add current counters to response
        add({
            _id: new Date(this.currentCounters.time),
            counters: this.currentCounters.counters
        });
        //add counters from db
        docs.forEach(add);

        function add(doc) {
            let groupTime = Math.floor(getGroupTime(groupByInterval, {naturalTime: doc._id}) / 1000);

            while (groupTime < lastGroup.time) {
                currentGroupIndex++;
                grouped.push(lastGroup);
                lastGroup = {
                    time: Math.floor(getGroupTime(groupByInterval, {groupOffset: -currentGroupIndex}) / 1000),
                    values: {},
                }
            }

            Object.keys(doc.counters).forEach(key => {
                let eventName = decodeEventName(key);
                lastGroup.values[eventName] = (lastGroup.values[eventName] || 0) + doc.counters[key];
            });
        }

        while (Math.floor(toDate / 1000) < lastGroup.time) {
            currentGroupIndex++;
            grouped.push(lastGroup);
            lastGroup = {
                time: Math.floor(getGroupTime(groupByInterval, {groupOffset: -currentGroupIndex}) / 1000),
                values: {},
            }
        }

        grouped.push(lastGroup);

        return grouped;
    }

    /**
     * Save counters to database
     */
    saveCounters() {
        if (this.currentCounters.hasNew) {
            this.countersCollection.updateOne(
                {_id: new Date(this.currentCounters.time)},
                {$inc: encodeCounters(this.currentCounters.counters)},
                {upsert: true}
            ).catch(console.error);

            this.currentCounters.counters = {};
            this.currentCounters.hasNew = false;
        }

        function encodeCounters(counters) {
            let encoded = {};
            Object.keys(counters).forEach((key) => {
                encoded["counters." + encodeEventName(key)] = counters[key];
            });
            return encoded;
        }

        this.currentCounters.time = getGroupTime(this.groupTimeInterval);
    }
}


module.exports = CountersTracker;