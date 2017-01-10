var dummyData = {
  "metro-4": {
    "Porte de Clignancourt": [3, 5],
    "Mairie de Montrouge": [4, 5]
  },
  "metro-6": {
    "Etoile": [3, 5],
    "Nation": [4, 5]
  },
  "metro-12": {
    "Aubervilliers": [3, 5],
    "Mairie d'Issy": [4, 5]
  },
  "metro-13": {
    "Asnières - Gennevilliers - Saint-Denis": [3, 5],
    "Châtillon": [4, 5]
  }
};

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
      return "--";
    case -2: //"Train a quai"
      return "--";
    case -3: //"Service termine"
      return "..";
    case -4: //"Train retarde"
      return "++";
    case -5: //"Train arrete"
      return "!!";
    case -42: //"Service terminé ou horaires indisponibles"
      return "??";
    default:
      return schedule;
  }
}

function refreshView(data) {
  var nextJourneysHTML = '';

  for (var line in data) {
    var lineType = line.split('-')[0];
    var lineNumber = line.split('-')[1];
    var lineDirections = data[line];

    var lineHTML = '<div class="line">';

    var i = 0;

    for (var direction in lineDirections) {
      lineHTML = lineHTML + '<div class="line-direction">';

      if (i == 0) {
        // First direction of line, let's display line type and number.
        lineHTML = lineHTML + '<span class="line-type"><span class="type ' + lineType + ' symbole">' + lineType + '</span><span class="line ' + lineType + ' ligne' + lineNumber + '">Ligne ' + lineNumber + '</span></span>';
      }
      i++;

      var directionName = lineDirections[direction].direction;
      var directionSchedules = lineDirections[direction].schedules;

      var nextOne = parseSchedule(directionSchedules[0]);
      var nextTwo = parseSchedule(directionSchedules[1]);

      lineHTML = lineHTML + '<span class="direction-name">' + directionName + '</span><span class="direction-timers"><span class="first-timer">' + nextOne + '</span>&nbsp;&nbsp;<span class="second-timer">' + nextTwo + '</span></span>';
      lineHTML = lineHTML + '</div>';
    }

    lineHTML = lineHTML + '</div>';

    nextJourneysHTML = nextJourneysHTML + lineHTML;
  }

  $('#next-journeys').html(nextJourneysHTML);
}

// Entry point
var socket = io();

socket.on('update', function(data) {
  refreshView(data);
});

socket.on('alert', function (data) {

});

socket.emit('init', null, function (data) {
  eachSecondEvent();
  setTimeout(eachSecondEvent, 1000);

  refreshView(data);
});
