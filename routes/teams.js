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

/* GET power picks given a team id */
router.get('/by-team-id/:team/:region', function(req, res, next) {
  let teamID = req.params.team;
  let teamRegion =  req.params.region;

  leagueAPI.getTeam(teamID, teamRegion, function(err, teamDTO) {
    if(err) {
      // TODO: Handle error!
      res.end();
    }

    // TODO: manuel
    console.log('teamDTO');
    console.log(teamDTO);
    res.send(teamDTO);
    return;

    let team = teamDTO[teamID];
    let matchIDs = [];
    for(let m in team.matchHistory) {
      if(!m.invalid) {
        matchIDs.push(m.gameId);
      }
    }

    let matchGrades = [];
    for(let m in matchIDs) {
      leagueAPI.getMatch(m, false, teamRegion, function(err, match) {
        if(err) {
          // TODO: Handle error!
          res.end();
        }

        let matchGrade = {};

        let gold = [];
        let kills = [];
        let assists = [];
        let deaths = [];

        for(let p in match.participants) {
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
        if(match.teams['100'].baronKills > match.teams['200'].baronKills) {
          baron = '100';
        } else if (match.teams['100'].baronKills < match.teams['200'].baronKills) {
          baron = '200';
        }

        let dragon = 'equal';
        if(match.teams['100'].dragonKills > match.teams['200'].dragonKills) {
          dragon = '100';
        } else if (match.teams['100'].dragonKills < match.teams['200'].dragonKills) {
          dragon = '200';
        }

        let tower = 'equal';
        if(match.teams['100'].towerKills > match.teams['200'].towerKills) {
          tower = '100';
        } else if (match.teams['100'].towerKills < match.teams['200'].towerKills) {
          tower = '200';
        }

        let inhibitor = 'equal';
        if(match.teams['100'].inhibitorKills > match.teams['200'].inhibitorKills) {
          inhibitor = '100';
        } else if (match.teams['100'].inhibitorKills < match.teams['200'].inhibitorKills) {
          inhibitor = '200';
        }

        for(let p in match.participants) {
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
          if(p.teamId === baron) { score ++; }
          if(p.teamId === dragon) { score ++; }
          if(p.teamId === tower) { score ++; }
          if(p.teamId === inhibitor) { score ++; }
          if(p.stats.winner) { score ++; }
          matchGrade[String(p.championId)] = score;
        }

        matchGrades.push(mathGrade);
      });
    }

    res.send(matchGrades);
  });
});

module.exports = router;
