let Statistics = require('./src/Statistics'),
	WebUI = require('./src/WebUI'),
	MongoClient = require('mongodb').MongoClient,
	eventNames = ["app_start", "app_start_ok", "app_start_fail", "detect_ok", "detect_fail"],
	currentIndex = 0;

(async () => {
	let db = await MongoClient.connect('mongodb://localhost:27017/statistics_test'),
		st = new Statistics({db}),
		webUI = new WebUI({statistics: st});

	webUI.listen(8181, () => console.log("WebUI started!"));

	trackRandomEvent();

	function trackRandomEvent(){
		let eventName = eventNames[currentIndex];
		currentIndex = (currentIndex + rand(5)) % eventNames.length;
		st.track({eventName});
		setTimeout(trackRandomEvent, rand(1000));
	}
	function rand(n){
		return Math.round(Math.random() * n);
	}
})();


