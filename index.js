const async = require('async')
const express = require('express.oi');
const api = require(__dirname + '/ratpAPI');

const app = express();

var cache = [];

app.http().io();

app.io.session({
  secret: 'dashboard me boy !',
  resave: false,
  saveUninitialized: true
});

app.use(express.static(__dirname + '/public'));

app.io.route('init', function(req, res) {
  res.json(cache);
});

app.listen(3000);

function parseSchedule(schedule, callback) {
  switch (schedule.message) {
    case "Train a l'approche":
      callback(null, -1);
      break;
    case "Train a quai":
      callback(null, -2);
      break;
    case "Service termine":
      callback(null, -3);
      break;
    case "Train retarde":
      callback(null, -4);
      break;
    case "Train arrete":
      callback(null, -5);
      break;
    case "Service terminé ou horaires indisponibles":
      callback(null, -42);
      break;
    default:
      var matches = schedule.message.match(/(\d+) mn/i);
      if (typeof matches === 'undefined' || !matches) {
        //Unhandled case
        console.log(schedule.message);
        callback(null, -42);
        return;
      }

      callback(null, parseInt(matches[1]));
  }
}

function refreshData() {
  async.mapSeries(api.URLs, api.retrieveURL, function(err, response) {
      async.reduce(response, {}, function(memo, item, callback) {
          var lineKey = item.response.informations.type + '-' + item.response.informations.line;

          if (typeof memo[lineKey] === 'undefined' || !memo[lineKey]) {
            memo[lineKey] = [];
          }

          var directionKey = item.response.informations.destination.name;

          async.map(item.response.schedules, parseSchedule, function (err, schedules) {
            var directionSchedule = {
              "direction": directionKey,
              "schedules": schedules
            };
            memo[lineKey].push(directionSchedule);
            callback(null, memo)
          });
      }, function(err, result) {
          cache = result;
          app.io.emit('update', result);
      });
  });

  setTimeout(refreshData, 10000);
}

refreshData();
