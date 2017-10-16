class EventsTracker{
	constructor({db, expire}){
		this.eventsCollection = db.collection('analytics_events');
		this.eventsCollection.createIndex({en: 1});
		this.eventsCollection.createIndex({date: 1}, expire ? {expireAfterSeconds: expire} : null);
	}

	/**
	 * Track new event
	 * @param {String} eventName
	 * @param {String} uid
	 * @param {*} data
	 */
	trackEvent({eventName, uid, data}){
		const event = {
			en: eventName,
			uid,
			data,
			date: new Date(),
		};

		this.eventsCollection.insertOne(event);
	}


	async getEvents({count, fromDate, eventsFilter}){
		let query = {};
		if(fromDate)
			query.date = {$lt: fromDate};
		if(eventsFilter)
			query.en = eventsFilter;

		return await this.eventsCollection
			.find(query)
			.sort({date: -1})
			.limit(count)
			.toArray();
	}
}

module.exports = EventsTracker;