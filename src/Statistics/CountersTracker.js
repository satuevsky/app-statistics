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
		self.saveCounters();
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
		this.countersCollection = db.collection('app_statistics_counters');
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


	async getCounters({groupByInterval, toDate}){
		let now = Date.now(),
			lastGroupTime = now - now % groupByInterval,
			toDateDiff = lastGroupTime - toDate,
			groupsCount = (toDateDiff / groupByInterval);

		if(groupsCount > 30){
			toDate = lastGroupTime - groupByInterval * 30;
		}

		let docs = await this.countersCollection
				.find({_id: {$gte: new Date(toDate)}})
				.sort({_id: -1})
				.toArray(),
			grouped = [],
			lastGroup = {};

		//add current counters to response
		add({
			_id: new Date(this.currentCounters.time),
			counters: this.currentCounters.counters
		});
		//add counters from db
		docs.forEach(add);

		function add(doc){
			let groupTime = Math.floor((doc._id - doc._id % groupByInterval)/1000);
			if(groupTime !== lastGroup.time){
				lastGroup = {time: groupTime, values: {}};
				grouped.push(lastGroup);
			}
			Object.keys(doc.counters).forEach(key => {
				let eventName = decodeEventName(key);
				lastGroup.values[eventName] = (lastGroup.values[eventName] || 0) + doc.counters[key];
			});
		}

		return grouped;
	}

	/**
	 * Save counters to database
	 */
	saveCounters(){
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