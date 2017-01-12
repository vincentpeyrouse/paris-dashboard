// Utils
function setToHappen(fn, d) {
    var t = d.getTime() - (new Date()).getTime();
    return setTimeout(fn, t);
}

function refreshTimer() {
    var t = new Date();
    $('#timer-hours').text(t.getHours());
    $('#timer-minutes').text((t.getMinutes() < 10 ? '0' : '') + t.getMinutes());
}

function eachSecondEvent() {
    refreshTimer();
    setTimeout(eachSecondEvent, 1000);
}

function parseSchedule(schedule) {
    switch (schedule) {
        case -1: //"Train a l'approche"
            return '<i class="fa fa-train animated"></i>';
        case -2: //"Train a quai"
            return '<i class="fa fa-train"></i>';
        case -3: //"Service termine"
            return "..";
        case -4: //"Train retarde"
            return "++";
        case -5: //"Train arrete"
            return "!!";
        case -6: //"A l'approche"
            return '<i class="fa fa-bus animated"></i>';
        case -7: //"A l'arret"
            return '<i class="fa fa-bus"></i>';
        case -8: //"Dernier passage"
            return '<i class="fa fa-bus"></i>';
        case -42: //"Service terminé ou horaires indisponibles"
            return "..";
        default:
            return schedule;
    }
}

function refreshSchedules(data) {
    var nextJourneysHTML = '';

    var i = 0;
    for (var line in data) {

        var lineType = line.split('-')[0];
        var lineNumber = line.split('-')[1];
        var lineDirections = data[line];

        var lineHTML = '<div class="line col-md-12 col-lg-6">';

        var j = 0;

        for (var direction in lineDirections) {
            lineHTML = lineHTML + '<div class="line-direction">';

            if (j == 0) {
                // First direction of line, let's display line type and number.
                lineHTML = lineHTML + '<span class="line-type"><span class="type ' + lineType + ' symbole">' + lineType + '</span><span class="line ' + lineType + ' ligne' + lineNumber + '">Ligne ' + lineNumber + '</span></span>';
            }
            j++;

            var directionName = lineDirections[direction].direction;
            var directionSchedules = lineDirections[direction].schedules;

            var nextOne = parseSchedule(directionSchedules[0] || -42);
            var nextTwo = parseSchedule(directionSchedules[1] || -42);

            lineHTML = lineHTML + '<span class="direction-name">' + directionName + '</span><span class="direction-timers"><span class="first-timer">' + nextOne + '</span>&nbsp;&nbsp;<span class="second-timer">' + nextTwo + '</span></span>';
            lineHTML = lineHTML + '</div>';
        }

        lineHTML = lineHTML + '</div>';

        if(i%2) {
          lineHTML = lineHTML + '<span class="clearfix"></span>';
        }
        i++;

        nextJourneysHTML = nextJourneysHTML + lineHTML;
    }

    $('#next-journeys').html(nextJourneysHTML);
}

function refreshTraffic(data) {
    for (trafficInfo of data) {
        switch (trafficInfo.status) {
            case 'normal':
                break;
            case 'normal_trav':
                break;
            case 'alerte':
                break;
            default:
                break;
        }
    }

}

// Entry point
var socket = io();

socket.on('schedules', function(data) {
    refreshSchedules(data);
});

socket.on('traffic', function(data) {
    refreshTraffic(data);
});

socket.emit('init', null, function(data) {
    eachSecondEvent();
    setTimeout(eachSecondEvent, 1000);
    refreshSchedules(data.schedules);
    refreshTraffic(data.traffic);
});
