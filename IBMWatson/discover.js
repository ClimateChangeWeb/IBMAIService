const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const discovery = new DiscoveryV1({
  version: '2019-04-30',
  authenticator: new IamAuthenticator({
    apikey: process.env.DISCOVER_API_KEY,
  }),
  serviceUrl: process.env.DISCOVER_URL,
});

//export the file
module.exports = {
  discovery,
};
