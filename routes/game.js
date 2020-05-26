var express = require('express');
var router = express.Router();
var Game = require('../controllers/game.js');

router.get('/', function(req, res, next) {
  res.json(Game.getRooms());
});

module.exports = router;
