'use strict';

var assert = require('assert');
var apiKey = require('../_/data.json').key;
var express = require('express');
var request = require('request');
var leagueAPI = require('leagueapi')
var router = express.Router();

/* GET home page. */
router.get('/by-summoner/:name/:region', function(req, res, next) {
  let summonerName = req.params.name;
  let summonerRegion =  req.params.region;

  leagueAPI.init(apiKey, summonerRegion);

  // get summoner id from summoner name
  leagueAPI.Summoner.getByName(summonerName, function(err, summoner) {
    if(err) {
      // TODO: Handle error!
      res.end();
    }

    let key = '';
    for(let k in summoner) { key = k; break; }
    let summonerID = String(summoner[key].id);

    // get summoner teams from summoner id
    leagueAPI.getTeams(summonerID, summonerRegion, function(err, teams) {
      if(err) {
        // TODO: Handle error!
        res.end();
      }

      let teamNames = [];
      let teamMembers = [];
      for(let teamNumber in teams[summonerID]) {
        teamNames.push({
          'name': teams[summonerID][teamNumber].name,
          'id': teams[summonerID][teamNumber].fullId,
        });
      }

      res.send(teamNames);
    });
  });
});

module.exports = router;
