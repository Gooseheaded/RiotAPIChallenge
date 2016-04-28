'use strict';

var assert = require('assert');
var express = require('express');
var ajax = require('ajax-request');
//var data = require('../data.json');
var router = express.Router();

/* GET home page. */
router.get('/by-summoner/:summoner_id', function(req, res, next) {
  let summID = Number(req.params.summoner_id);
  assert(typeof summID === 'number', 'Summoner ID was not a number!');

  let region = 'lan';
  let url = 'https://lan.api.pvp.net/api/lol/' + region +
  '/v2.4/team/by-summoner/' + summID +
  '?api_key=80639ae1-4c81-4e81-a147-67ae8df88074';

  console.log('EXCECUTING REQUEST AT: ' + url);
  
  var request = require("request");
  

  request.get(url, function(err, res, body) {
    if(err) {
      console.log(err);
      
    }
    console.log(body);
  });
});

module.exports = router;
