let path = require('path'),
	api = require('./api'),
	express = require("express"),
	assets = require('./client/build/asset-manifest.json');



function getAssets(baseUrl){
	baseUrl = baseUrl || "/";
	return {
		"main.css": path.posix.resolve(baseUrl, assets["main.css"]),
		"main.js": path.posix.resolve(baseUrl, assets["main.js"])
	}
}

function configureExpress(self){
	self.use('/api', api.getApi({context: self}));
	self.use('/static', express.static(path.resolve(__dirname, "client/build/static")));

	self.set('view engine', 'jade');
	self.set('views', path.resolve(__dirname, "./client/views"));

	self.get('*', (req, res) => {
		const baseUrl = req.baseUrl;
		res.render('index', {assets: getAssets(baseUrl), baseUrl});
	});
}


function WebUI({statistics, expressApp}={}){
	const self = expressApp || express();

	self.statistics = statistics;
	configureExpress(self);

	return self;
}

module.exports = WebUI;