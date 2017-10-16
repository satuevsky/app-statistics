let Method = require('vkl-api').Method;

module.exports = new Method('counters.get', {params: {name: String}}, (req, res) => {
	res.ok(fakeCounters);
});

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
}
