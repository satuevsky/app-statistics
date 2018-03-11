let vklapi = require('vkl-api');

module.exports = {
    getApi({context}) {
        let apiServer = vklapi.Server({context});

        apiServer.addMethod(require('./counters-get'));
        apiServer.addMethod(require('./events-get'));

        return apiServer;
    }
};