const express = require('express');
const router = express.Router();
const morgan = require('morgan');
var fs = require('fs');
var path = require('path');
const discovery = require('./IBMWatson/discover');
const environmentId = 'system';
const collectionId = 'news-en';

const textToSpeech = require('./IBMWatson/textToSpeech');
const synthesizeParams = {
  text: 'Hello world',
  accept: 'audio/wav',
  voice: 'en-US_AllisonV3Voice',
};

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

router.get('/textToSpeech', (req, res) => {
  textToSpeech.textToSpeech
    .synthesize(synthesizeParams)
    .then((response) => {
      // The following line is necessary only for
      // wav formats; otherwise, `response.result`
      // can be directly piped to a file.
      return textToSpeech.textToSpeech.repairWavHeaderStream(response.result);
    })
    .then((buffer) => {
      //example for now
      //TODO:
      //check if the file exist? create file : send file
      //fs.writeFileSync('hello_world.wav', buffer);
    })
    .catch((err) => {
      console.log('error:', err);
    });

  res.sendFile(path.join(__dirname, 'hello_world.wav'));
});
module.exports = router;
