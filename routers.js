const express = require('express');
const router = express.Router();
const morgan = require('morgan');
var fs = require('fs');
var path = require('path');
const discovery = require('./IBMWatson/discover');
const environmentId = 'system';
const collectionId = 'news-en';

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});
router.use(morgan('combined', { stream: accessLogStream }));
router.use(morgan('tiny'));
//we are defining a new parameter called host
morgan.token('host', function (req, res) {
  return req.hostname;
});

router.get('/discover', (req, res) => {
  const name = req.query.name;
  //query parameters
  let queryParams = {
    environmentId: environmentId,
    collectionId: collectionId,
    query: 'Climate changes',
  };

  console.log(name);
  discovery.discovery
    .query(queryParams)
    .then((queryResponse) => {
      console.log(JSON.stringify(queryResponse, null, 2));
      res.send(JSON.stringify(queryResponse, null, 2));
    })
    .catch((err) => {
      console.log('error:', err);
    });
});

module.exports = router;
