'use strict';

var assert = require('assert');
var apiKey = require('../_/data.json').key;
var express = require('express');
var request = require('request');
var leagueAPI = require('leagueapi');
var misc = require('../misc.js');
var router = express.Router();

/* GET list of teams given a summoner name */
router.get('/by-summoner-name/:name/:region', function(req, res, next) {
  let summonerName = req.params.name;
  let summonerRegion =  req.params.region;
  leagueAPI.init(apiKey, summonerRegion);
  leagueAPI.setRateLimit(9, 499);

  // get summoner id from summoner name
  leagueAPI.Summoner.getByName(summonerName, function(err, summoner) {
    if(err) {
      console.log(err);
      // TODO: Handle error!
      res.end();
      return;
    }

    let key = '';
    for(let k in summoner) { key = k; break; }
    let summonerID = String(summoner[key].id);

    // get summoner teams from summoner id
    leagueAPI.getTeams(summonerID, summonerRegion, function(err, teams) {
      if(err) {
        console.log(err);
        // TODO: Handle error!
        return;
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
  leagueAPI.setRateLimit(9, 499);

  leagueAPI.getTeam(teamID, teamRegion, function(err, teamDTO) {
    if(err) {
      console.log('leagueAPI.getTeam');
      console.log(err);
      // TODO: Handle error!
      res.end();
    }

    let team = teamDTO[teamID];
    let matchIDs = [];
    let maxMatches = 10;
    for(let m of team.matchHistory) {
      if(maxMatches <= 0) {
        break;
      }
      if(m.invalid) {
        continue;
      }

      matchIDs.push([m.gameId, m.win]);
      maxMatches --;
    }

    let matchGrades = [];
    for(let m in matchIDs) {
      console.log('Adding id: ' + matchIDs[m]);
      leagueAPI.getMatch(matchIDs[m][0], false, teamRegion, function(err, match) {
        console.log();
        console.log('Retrieving info for match: '+matchIDs[m][0]+' ['+(Number(m)+1)+'/'+matchIDs.length+']');
        if(err) {
          console.log('leagueAPI.getMatch');
          console.log(err);
          // TODO: Handle error!
          return;
        }

        let thisTeam = 0;
        if(match.teams[0].winner === matchIDs[m][1]) {
          thisTeam = match.teams[0].teamId;
        } else {
          thisTeam = match.teams[1].teamId;
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

        gold.sort((a,b) => a.value < b.value);
        kills.sort((a,b) => a.value < b.value);
        assists.sort((a,b) => a.value < b.value);
        deaths.sort((a,b) => a.value > b.value);

        let baron = 'equal';
        if(match.teams[0].baronKills > match.teams[1].baronKills) {
          baron = 100;
        } else if (match.teams[0].baronKills < match.teams[1].baronKills) {
          baron = 200;
        }

        let dragon = 'equal';
        if(match.teams[0].dragonKills > match.teams[1].dragonKills) {
          dragon = 100;
        } else if (match.teams[0].dragonKills < match.teams[1].dragonKills) {
          dragon = 200;
        }

        let tower = 'equal';
        if(match.teams[0].towerKills > match.teams[1].towerKills) {
          tower = 100;
        } else if (match.teams[0].towerKills < match.teams[1].towerKills) {
          tower = 200;
        }

        let inhibitor = 'equal';
        if(match.teams[0].inhibitorKills > match.teams[1].inhibitorKills) {
          inhibitor = 100;
        } else if (match.teams[0].inhibitorKills < match.teams[1].inhibitorKills) {
          inhibitor = 200;
        }

        for(let p of match.participants) {
          if(p.teamId != thisTeam) {
            continue;
          }
          let debug = '';
          let score = 0;

          for(let i = 0; i < 5; i ++) {
            if(gold[i].id === p.championId) { score ++; debug += '$'; }
            if(kills[i].id === p.championId) { score ++; debug += 'k';}
            if(assists[i].id === p.championId) { score ++; debug += 'a'; }
            if(deaths[i].id === p.championId) { score ++; debug += 'x'; }
          }

          if(p.stats.firstBloodAssist || p.stats.firstBloodKill) { score ++; debug += 'FB'; }
          if(p.stats.firstTowerAssist || p.stats.firstTowerKill) { score ++; debug += 'FT';}
          if(p.stats.firstInhibitorAssist || p.stats.firstInhibitorKill) { score ++; debug += 'FI';}
          if(p.teamId === baron || baron === 'equal') { score ++; debug += 'b';}
          if(p.teamId === dragon || dragon === 'equal') { score ++;debug += 'd'; }
          if(p.teamId === tower || tower === 'equal') { score ++; debug += 't';}
          if(p.teamId === inhibitor || inhibitor === 'equal') { score ++; debug += 'i';}
          if(p.stats.winner) { score ++; debug += 'w';}

          var kdacs = '' +
            p.stats.kills + '/'
            + p.stats.deaths + '/'
            + p.stats.assists + ','
            + p.stats.minionsKilled;

          matchGrade[String(p.championId)] = [score, debug, kdacs];
        }

        let counter = 0;
        leagueAPI.setRateLimit(999, 9999);
        for(let k in matchGrade) {
          let stop = false;
          leagueAPI.Static.getChampionById(k, {}, function(err, champ) {
            if(err) {
              console.log('leagueAPI.Static.getChampionById');
              console.log(err);
              return;
            }
            matchGrade[champ.name] = {
              'kdacs': matchGrade[k][2],
              'score': matchGrade[k][0],
              'debug': matchGrade[k][1],
            };
            delete matchGrade[k];
            counter ++;
            matchGrades.push(matchGrade);
            console.log(champ.name, matchGrade[champ.name]);

            // FINAL PROCESSING
            if(counter >= 5 && Number(m)+1 === matchIDs.length) {
              let powerPicks = {};
              for(let mg of matchGrades) {
                for(let champ in mg) {
                  let prev = powerPicks[champ] ? powerPicks[champ] : {'score': 0, 'count': 0}
                  powerPicks[champ] = {
                    'name': champ,
                    'score': prev.score + mg[champ].score,
                    'count': prev.count + 1,
                  };
                }
              }

              let final = [];
              for(let champ in powerPicks) {
                final.push({
                  'name': champ,
                  'grade': misc.scoreToGrade(Math.floor(powerPicks[champ].score / powerPicks[champ].count)),
                });
              }

              let postFinal = [final[0]];
              let reference = 0;
              for(let f in final) {
                if(f == 0) { continue; }
                postFinal.push(final[f]);
                reference = f;
                while(reference > 0 && misc.gradeToScore(postFinal[reference].grade) > misc.gradeToScore(postFinal[reference-1].grade)) {
                  let aux = postFinal[reference-1];
                  postFinal[reference-1] = postFinal[reference];
                  postFinal[reference] = aux;
                  reference --;
                }
              }
              powerPicks = {};
              for(let champ of postFinal) {
                powerPicks[champ.name] = champ.grade;
              }

              console.log();
              console.log('Delivered.')
              console.log();
              res.send(powerPicks);
              stop = true;
              return;
            }
          });
          if(stop) break;
        }
      });
    }
  });
});

module.exports = router;
