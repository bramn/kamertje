var express = require('express');
var router = express.Router();
var Game = require('../controllers/game.js');

router.get('/', function(req, res, next) {
  Game.getRooms().then(function(result) {
    res.json(result);
  })
});

module.exports = router;
