const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config();

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.TEXT_TO_SPEECH_API_KEY,
  }),
  serviceUrl: process.env.TEXT_TO_SPEECH_URI,
});

//export the file
module.exports = {
  textToSpeech,
};
