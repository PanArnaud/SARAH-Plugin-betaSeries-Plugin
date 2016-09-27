var request = require('request');
var moment = require('moment');

var url = 'http://api.betaseries.com/';
var token_url = 'https://api.betaseries.com/members/auth';
var planning_url = 'https://api.betaseries.com/planning/member';
var key = 'CLE_API_BETASERIES';
var login = 'VOTRE_ID_BETASERIES';
var password = require('crypto').createHash('md5').update('VOTRE_MOT_DE_PASSE_BETASERIES').digest('hex');

exports.action = function(data, callback, config, SARAH) {
 maConfig = config.modules.betaSeries;

 SARAH.speak('Un instant sil vous plait');

 request({
   'uri' : token_url+'?login='+login+'&password='+password,
   'method': 'POST',
   'headers': {
     'X-BetaSeries-Version': '2.4',
     'X-BetaSeries-Key': key,
   }
 }, function (err, response, token){
   if (err || response.statusCode != 200) {
     callback({'tts': "L'action a échoué"});
     return;
   }
   token = JSON.parse(token)

   if(data.commande == 'getSerie') {
        var series =
          request({
            'uri' : planning_url+'?access_token=' + token.token + '&view=unseen',
            'method': 'GET',
            'headers': {
              'X-BetaSeries-Version': '2.4',
              'X-BetaSeries-Key': key,
            }
          }, function (err, response, allNextSeries){
            if (err || response.statusCode != 200) {
              callback({'tts': "L'action a échoué numero deux"});
              return;
            }
            allNextSeries = JSON.parse(allNextSeries);

            series = [];
            var pending = Object.keys(allNextSeries.episodes).length;

            for (var i = 0; i < Object.keys(allNextSeries.episodes).length; i++) {
              if(moment(allNextSeries.episodes[i].date).isBetween(moment(), moment().add(7, 'days'), 'day', '[]')){
                var date = moment(allNextSeries.episodes[i].date).format();
                series.push({
                    date: date,
                    title: allNextSeries.episodes[i].show['title'],
                    season: allNextSeries.episodes[i].season,
                    episode: allNextSeries.episodes[i].episode,
                });
              }
              if(!--pending){
                for_today(series, function(result){
                  if (result){
                    SARAH.speak ("disponible aujourd'hui", function(){
                      speak_series (SARAH, true, series, 0, speak_series);
                    });
                  }else{
                    SARAH.speak ("il n'y a pas de séries pour aujourd'hui", function() {
                      for_nextdays(series,function (result){
                        if (result)
                          SARAH.speak ("pour les prochains jours", function(){
                            speak_series (SARAH, false, series, 0, speak_series);
                          });
                        else
                          SARAH.speak ("il n'y a pas de séries pour les prochains jours");
                      });
                    });
                  }
                });
              }
            }
          });
      }
  });
 callback({});
}

var speak_series = function (SARAH, today, series, i , callback ) {
  if (i == series.length) {
    if (today) {
      for_nextdays(series, function(result){
        if(result)
          SARAH.speak ("pour les prochains jours", function() {
            setTimeout(function(){
              callback (SARAH, false, series, 0 , callback);
            }, 1000);
          });
        else
          SARAH.speak ("il n'y a pas de séries pour les prochains jours");
      });
    }
    return;
  }

  var tts;
  if(today && moment(series[i].date).isSame(moment(), 'day')){
    tts = series[i].title + ", saison "+ series[i].season + ", episode " + series[i].episode;
  }else if (!today && moment(series[i].date).isBetween(moment(), moment().add(7, 'days'), 'day', '(]')){
    tts = series[i].title + ", saison "+ series[i].season + ", episode " + series[i].episode + ", en ligne le "+ moment(series[i].date).format("dddd D MMMM ");
  }else{
    return callback (SARAH, today, series, ++i , callback);
  }

  SARAH.speak(tts, function () {
    setTimeout(function(){
      callback (SARAH, today, series, ++i , callback);
    }, 1500);
  });
}

var for_today = function (series, callback) {
  var found = false;
  for (var i = 0; i < series.length; i++) {
    if(moment(series[i].date).isSame(moment(), 'day'))
      found = true;
  }
  callback(found);
}

var for_nextdays = function (series,callback) {
  var found = false;
  for (var i = 0; i < series.length; i++) {
    if(moment(series[i].date).isBetween(moment(), moment().add(7, 'days'), 'day', '[]'))
      found = true;
  }
  callback(found);
}
