exports.URLs = [
  'https://api-ratp.pierre-grimaud.fr/v2/metros/4/stations/152?destination=13',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/4/stations/152?destination=14',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/6/stations/152?destination=8',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/6/stations/152?destination=17',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/12/stations/152?destination=30',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/12/stations/152?destination=31',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=32',
  'https://api-ratp.pierre-grimaud.fr/v2/metros/13/stations/152?destination=33'
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
