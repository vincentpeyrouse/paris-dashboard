const async = require('async')
const express = require('express.oi');
const api = require(__dirname + '/ratpAPI');

const app = express();

var cache = {
    'schedules': [],
    'traffic': []
};

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
        case "A l'approche":  //BUS
            callback(null, -6);
            break;
        case "A l'arret":     //BUS
            callback(null, -7);
            break;
        case "DERNIER PASSAGE": //BUS
            callback(null, -8);
            break;
        case "Service terminé ou horaires indisponibles":
        case "SERVICE TERMINE":
        case "SERVICE":
        case "NON COMMENCE":
        case "..................":
        case "INFO INDISPO ....":
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

function refreshSchedules() {
    async.mapSeries(api.URLs, api.retrieveURL, function(err, response) {
        async.reduce(response, {}, function(memo, item, callback) {
            var lineKey = item.response.informations.type + '-' + item.response.informations.line;

            if (typeof memo[lineKey] === 'undefined' || !memo[lineKey]) {
                memo[lineKey] = [];
            }

            var directionKey = item.response.informations.destination.name;

            async.map(item.response.schedules, parseSchedule, function(err, schedules) {
                var directionSchedule = {
                    "direction": directionKey,
                    "schedules": schedules
                };
                memo[lineKey].push(directionSchedule);
                callback(null, memo)
            });
        }, function(err, result) {
            cache['schedules'] = result;
            app.io.emit('schedules', result);
        });
    });

    setTimeout(refreshSchedules, 20000);
}

function refreshTraffic() {
    const trafficURL = 'https://api-ratp.pierre-grimaud.fr/v2/traffic/';

    api.retrieveURL(trafficURL, function(err, response) {
        var trafficInfos = [];

        for (var type in response.response) {
            // Adapt linetype
            var linetype = '';

            switch (type) {
                case 'tramways':
                    linetype = 'tramway';
                    break;
                case 'metros':
                    linetype = 'metro';
                    break;
                default:
                    linetype = type;
            }

            // Loop on all lines of type
            for (line of response.response[type]) {
                var lineTraffic = line;

                var trafficInfo = {
                    status: lineTraffic['slug'],
                    title: lineTraffic['title'],
                    message: lineTraffic['message']
                };

                var lineId = (linetype == 'metro') ? lineTraffic.line.toLowerCase(): lineTraffic.line;

                trafficInfos[linetype + '-' + lineId] = trafficInfo;
            }
        }

        app.io.emit('traffic', trafficInfos);
        setTimeout(refreshTraffic, 60000);
    });
}

refreshSchedules();
refreshTraffic();
