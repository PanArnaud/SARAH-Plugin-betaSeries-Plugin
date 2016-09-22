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
            var now = moment();

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
            }

            for (var i = 0; i < Object.keys(series).length; i++) {
              if(moment(series[i].date).isSame(moment(), 'day')) {
                SARAH.speak(series[i].title + ", saison "+ series[i].season + ", episode " + series[i].episode + ", disponible aujourd'hui");
              } else {
                SARAH.speak(series[i].title + ", saison "+ series[i].season + ", episode " + series[i].episode + ", en ligne le "+ moment(series[i].date).format("dddd D MMMM "));
              }
            }
          });
      }
  });
 callback({});
}
