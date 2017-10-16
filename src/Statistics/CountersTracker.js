const s = 1000,
	  m = s*60,
	  h = m*60;


function normalizeGroupTimeInterval(time){
	if(!time)return h;
	if(!Number.isInteger(time) || time < 1000){
		throw new Error("groupTimeInterval must be integer and not less then 1000 (one second)");
	}
	return time;
}
function getCurrentGroupTime(groupTimeInterval){
	let now = new Date();
	return now - now % groupTimeInterval;
}
function setNextAutoFlushTimeout(self){
	let nextGroupTime = self.currentCounters.time + self.groupTimeInterval,
		nextAutoFlushTimeout = Math.min(nextGroupTime - Date.now(), self.autoFlushInterval);

	setTimeout(() => {
		self.flushCounters();
		setNextAutoFlushTimeout(self);
	}, nextAutoFlushTimeout)
}

function encodeEventName(eventName){
	return eventName.replace(/(\.)/g, "&2e").replace(/^(\$)/, "&24")
}
function decodeEventName(eventName){
	return eventName.replace(/(&2e)/g, ".").replace(/^(&24)/, "$")
}



class CountersTracker{
	constructor({db, groupTimeInterval=h, autoFlushInterval=10*s}) {
		this.countersCollection = db.collection('analytics_counters');
		this.groupTimeInterval = normalizeGroupTimeInterval(groupTimeInterval);
		this.autoFlushInterval = autoFlushInterval;
		this.currentCounters = {
			counters: {},
			hasNew: false,
			time: getCurrentGroupTime(this.groupTimeInterval),
		};

		setNextAutoFlushTimeout(this);
	}

	/**
	 * Track new event
	 * @param {String} eventName - Event name
	 */
	trackEvent({eventName}){
		this.currentCounters.counters[eventName] = (this.currentCounters.counters[eventName] || 0) + 1;
		this.currentCounters.hasNew = true;
	}


	async getCounters({groupByInterval, toDate, groupsLimit}){
		let now = Date.now(),
			curGT = now - now%groupByInterval;
		toDate = Math.max(toDate || 0, curGT - (groupsLimit-1)*groupByInterval);

		let docs = await this.countersCollection
				.find({_id: {$gte: new Date(toDate)}})
				.sort({_id: -1})
				.toArray(),
			grouped = [],
			lastGroup = {};

		docs.forEach(doc => {
			let groupTime = doc._id - doc._id % groupByInterval;
			if(groupTime !== lastGroup.date){
				lastGroup = {date: groupTime, counters: {}};
				grouped.push(lastGroup);
			}
			Object.keys(doc.counters).forEach(key => {
				let eventName = decodeEventName(key);
				lastGroup.counters[eventName] = (lastGroup.counters[eventName] || 0) + doc.counters[key];
			});
		});

		return grouped;
	}

	/**
	 * Save counters to database
	 */
	flushCounters(){
		if(this.currentCounters.hasNew){
			this.countersCollection.updateOne(
				{_id: new Date(this.currentCounters.time)},
				{$inc: encodeCounters(this.currentCounters.counters)},
				{upsert: true}
			);

			this.currentCounters.counters = {};
			this.currentCounters.hasNew = false;
		}

		function encodeCounters(counters){
			return Object.keys(counters).reduce((encoded, key)=>{
				encoded["counters." + encodeEventName(key)] = counters[key];
				return encoded;
			}, {});
		}


		let currentGroupTime = getCurrentGroupTime(this.groupTimeInterval);
		if(this.currentCounters.time !== currentGroupTime){
			this.currentCounters.time = currentGroupTime;
		}
	}
}

module.exports = CountersTracker;