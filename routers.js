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
  text: `Scientists think that Earth's temperature will keep going up for the next 100 years. This would cause more snow and ice to melt. Oceans would rise higher. Some places would get hotter. Other places might have colder winters with more snow. Some places might get more rain. Other places might get less rain. Some places might have stronger hurricanes.

  Scientists think we can do things to stop the climate from changing as much. You can help by using less energy and water. Turn off lights and TVs when you leave a room. Turn off the water when brushing your teeth. You also can help by planting trees.`,
  // text: `Many things can cause climate to change all on its own. Earth's distance from the sun can change. The sun can send out more or less energy. Oceans can change. When a volcano erupts, it can change our climate.

  // Most scientists say that humans can change climate too. People drive cars. People heat and cool their houses. People cook food. All those things take energy. One way we get energy is by burning coal, oil and gas. Burning these things puts gases into the air. The gases cause the air to heat up. This can change the climate of a place. It also can change Earth's climate.`,
  // text: `Climate change is a change in the usual weather found in a place. This could be a change in how much rain a place usually gets in a year. Or it could be a change in a place's usual temperature for a month or season.

  // Climate change is also a change in Earth's climate. This could be a change in Earth's usual temperature. Or it could be a change in where rain and snow usually fall on Earth.

  // Weather can change in just a few hours. Climate takes hundreds or even millions of years to change.`,
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
      // fs.writeFileSync('You Can Help!.wav', buffer);
    })
    .catch((err) => {
      console.log('error:', err);
    });

  // res.sendFile(path.join(__dirname, 'hello_world.wav'));
  res.send('generated finish');
});
module.exports = router;
