let Method = require('vkl-api').Method;

module.exports = new Method('counters.get', {params: {
		//seconds to group counters.
		interval: {type: Number, default: 3600, minValue: 1},
		//get counters to this date (timestamp/1000).
		toDate: Number
	}},
	async (req, res) => {
		try{
			let counters = await req.context.statistics.getCounters({
				groupByInterval: req.params.interval * 1000,
				toDate: req.params.toDate * 1000,
			});
			res.ok(counters);
		}catch (e){
			res.error(-1);
		}
	});

/*
let fakeCounters = [],
	date = Date.now(),
	s = 1000,
	m = 60*s,
	h = 60*m,
	d = 24*h;

function rand(){
	return Math.round(Math.random() * 1000);
}

while(Date.now() - date < d){
	let tg = date - date%h;
	fakeCounters.push({
		time: tg,
		values: {
			app_start: rand(),
			detect_ok: rand(),
			detect_fail: rand(),
			wall_post: rand(),
			photo_save: rand(),
			open_friends: rand(),
			messages: rand(),
			likes: rand()
		}
	});
	date -= h;
}*/
