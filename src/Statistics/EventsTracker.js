class EventsTracker {
    constructor({db, expire}) {
        this.eventsCollection = db.collection('app_statistics_events');

        this.eventsCollection
            .createIndex({en: 1})
            .catch(console.error);

        this.eventsCollection
            .createIndex({date: 1}, expire ? {expireAfterSeconds: expire} : null)
            .catch(console.error);
    }

    /**
     * Track new event
     * @param {String} eventName
     * @param {String} uid
     * @param {*} data
     */
    trackEvent({eventName, uid, data}) {
        const event = {
            en: eventName,
            uid,
            data,
            date: new Date(),
        };

        this.eventsCollection.insertOne(event);
    }


    async getEvents({count, fromDate, toDate, eventsFilter}) {
        let query = {};
        if (eventsFilter) {
            query.en = eventsFilter;
        }
        if (fromDate || toDate) {
            query.date = {};
            if (fromDate) {
                query.date.$lt = new Date(fromDate);
            }
            if (toDate) {
                query.date.$gt = new Date(toDate);
            }
        }

        return (await this.eventsCollection
            .find(query)
            .sort({date: -1})
            .limit(count)
            .toArray())
            .map(e => {
                e.date = e.date.getTime();
                return e;
            });
    }
}

module.exports = EventsTracker;