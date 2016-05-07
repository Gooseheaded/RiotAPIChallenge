'use strict';

var assert = require('assert');
var apiKey = require('../_/data.json').key;
var express = require('express');
var request = require('request');
var leagueAPI = require('leagueapi')
var router = express.Router();

/* GET list of teams given a summoner name */
router.get('/by-summoner-name/:name/:region', function(req, res, next) {
  let summonerName = req.params.name;
  let summonerRegion =  req.params.region;
  leagueAPI.init(apiKey, summonerRegion);

  // get summoner id from summoner name
  leagueAPI.Summoner.getByName(summonerName, function(err, summoner) {
    if(err) {
      console.log(err);
      // TODO: Handle error!
      res.end();
    }

    let key = '';
    for(let k in summoner) { key = k; break; }
    let summonerID = String(summoner[key].id);

    // get summoner teams from summoner id
    leagueAPI.getTeams(summonerID, summonerRegion, function(err, teams) {
      if(err) {
        console.log(err);
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

/* GET power picks given a team id */
router.get('/by-team-id/:team/:region', function(req, res, next) {
  let teamID = req.params.team;
  let teamRegion =  req.params.region;
  leagueAPI.init(apiKey, teamRegion);

  leagueAPI.getTeam(teamID, teamRegion, function(err, teamDTO) {
    if(err) {
      console.log('leagueAPI.getTeam');
      console.log(err);
      // TODO: Handle error!
      res.end();
    }

    let team = teamDTO[teamID];
    let matchIDs = [];
    for(let m of team.matchHistory) {
      if(!m.invalid) {
        matchIDs.push(m.gameId);
      }
    }

    let matchGrades = [];
    for(let m of matchIDs) {
      console.log('Checking id: ' + m);
      leagueAPI.getMatch(m, false, teamRegion, function(err, match) {
        if(err) {
          console.log('leagueAPI.getMatch');
          console.log(err);
          // TODO: Handle error!
          res.end();
          return;
        }

        let matchGrade = {};

        let gold = [];
        let kills = [];
        let assists = [];
        let deaths = [];

        for(let p of match.participants) {
          gold.push(
            {'id': p.championId, 'value': p.stats.goldEarned, 'team':p.teamId}
          );
          kills.push(
            {'id': p.championId, 'value': p.stats.kills, 'team':p.teamId}
          );
          assists.push(
            {'id': p.championId, 'value': p.stats.assists, 'team':p.teamId}
          );
          deaths.push(
            {'id': p.championId, 'value': p.stats.deaths, 'team':p.teamId}
          );
        }

        gold.sort((a,b) => a.value > b.value);
        kills.sort((a,b) => a.value > b.value);
        assists.sort((a,b) => a.value > b.value);
        deaths.sort((a,b) => a.value < b.value);

        let baron = 'equal';
        if(match.teams[0].baronKills > match.teams[1].baronKills) {
          baron = '100';
        } else if (match.teams[0].baronKills < match.teams[1].baronKills) {
          baron = '200';
        }

        let dragon = 'equal';
        if(match.teams[0].dragonKills > match.teams[1].dragonKills) {
          dragon = '100';
        } else if (match.teams[0].dragonKills < match.teams[1].dragonKills) {
          dragon = '200';
        }

        let tower = 'equal';
        if(match.teams[0].towerKills > match.teams[1].towerKills) {
          tower = '100';
        } else if (match.teams[0].towerKills < match.teams[1].towerKills) {
          tower = '200';
        }

        let inhibitor = 'equal';
        if(match.teams[0].inhibitorKills > match.teams[1].inhibitorKills) {
          inhibitor = '100';
        } else if (match.teams[0].inhibitorKills < match.teams[1].inhibitorKills) {
          inhibitor = '200';
        }

        for(let p of match.participants) {
          let score = 0;

          for(let i = 0; i < 5; i ++) {
            if(gold[i].id === p.championId) { score ++; }
            if(kills[i].id === p.championId) { score ++; }
            if(assists[i].id === p.championId) { score ++; }
            if(deaths[i].id === p.championId) { score ++; }
          }
          if(p.stats.firstBloodAssist || p.stats.firstBloodKill) { score ++; }
          if(p.stats.firstTowerAssist || p.stats.firstTowerKill) { score ++; }
          if(p.stats.firstInhibitorAssist || p.stats.firstInhibitorKill) { score ++; }
          if(p.teamId === baron || baron === 'equal') { score ++; }
          if(p.teamId === dragon || dragon === 'equal') { score ++; }
          if(p.teamId === tower || tower === 'equal') { score ++; }
          if(p.teamId === inhibitor || inhibitor === 'equal') { score ++; }
          if(p.stats.winner) { score ++; }
          matchGrade[String(p.championId)] = score;
        }
        console.log(matchGrade);
        matchGrades.push(matchGrade);
      });
      break;  // TODO: remove
    }

    res.send(matchGrades);
  });
});

module.exports = router;
