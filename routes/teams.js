'use strict';

var assert = require('assert');
var express = require('express');
var ajax = require('ajax-request');
var data = require('../data.json');
var router = express.Router();

/* GET home page. */
router.get('/by-summoner/:summoner_id', function(req, res, next) {
  let summID = Number(req.params.summoner_id);
  assert(typeof summID === 'number', 'Summoner ID was not a number!');

  let region = 'lan';
  let url = 'https://lan.api.pvp.net/api/lol/' + region +
  '/v2.4/team/by-summoner/' + summID +
  '&api_key=' + data.key;

  console.log('EXCECUTING REQUEST AT: ' + url);

  ajax(url, function(err, res, body) {
    if(err) {
      console.log(err);
      return;
    }
    res.send(body);
  });
});

module.exports = router;