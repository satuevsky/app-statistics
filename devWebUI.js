let Statistics = require('./src/Statistics'),
    WebUI = require('./src/WebUI'),
    MongoClient = require('mongodb').MongoClient,
    eventNames = ["app_start", "app_start_ok", "app_start_fail", "detect_ok", "detect_fail"],
    currentIndex = 0;

(async () => {
    let db = await MongoClient.connect('mongodb://localhost:27017/statistics_test'),
        statistics = new Statistics({db, listenConsole: true}),
        webUI = new WebUI({
            statistics,
            counterGroups: [
                {
                    name: "detection",
                    items: ["detect_ok", "detect_fail", "detect_fail2"]
                },
                {
                    name: "app_starting",
                    items: ["app_start", "app_start_ok", "app_start_fail"]
                }
            ]
        });

    webUI.listen(8181, () => console.log("WebUI started!"));

    trackRandomEvent();

    function trackRandomEvent() {
        let eventName = eventNames[currentIndex];
        currentIndex = (currentIndex + rand(5)) % eventNames.length;
        statistics.track({eventName, uid: rand(100000000), data: "some data " + rand(999)});

        let r = rand(10);

        /*if(r < 3){
            console.error(1,3,["sa",1], {});
        }else if(r < 5){
            console.warn(1,3,["sa",1], {});
        }else if(r < 7){
            console.log(1,3,["sa",1], {});
        }*/

        setTimeout(trackRandomEvent, rand(2000));
    }

    function rand(n) {
        return Math.round(Math.random() * n);
    }
})();


