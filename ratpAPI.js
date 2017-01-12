exports.URLs = [
  'https://api-ratp.pierre-grimaud.fr/v2/metros/4/stations/152?destination=13',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/4/stations/152?destination=14',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/6/stations/152?destination=8',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/6/stations/152?destination=17',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/12/stations/152?destination=30',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/12/stations/152?destination=31',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=32',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=33',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/28/stations/2557?destination=70',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/28/stations/2557?destination=160',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/58/stations/2557?destination=28',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/58/stations/2557?destination=208',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/91/stations/2557?destination=261',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/91/stations/2557?destination=262',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/92/stations/2557?destination=249',
  //'https://api-ratp.pierre-grimaud.fr/v2/bus/92/stations/2557?destination=264',
  //'https://api-ratp.pierre-grimaud.fr/v2/bus/94/stations/2557?destination=264',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/94/stations/2557?destination=268',
  //'https://api-ratp.pierre-grimaud.fr/v2/bus/95/stations/2557?destination=210',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/95/stations/2557?destination=269',
  'https://api-ratp.pierre-grimaud.fr/v2/bus/96/stations/2557?destination=12'
];

const https = require('https');

exports.retrieveURL = function (url, callback) {
  https.get(url, function (res) {
      var body = '';

      res.on('data', function (chunk) {
          body += chunk;
      });

      res.on('end', function () {
          var jsonResponse = JSON.parse(body);
          callback(null, jsonResponse);
      });
  }).on('error', function (e) {
    callback(e, null);
  });
};
