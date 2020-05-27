var express = require('express');
var router = express.Router();
var Game = require('../controllers/game.js');

router.get('/', async function (req, res, next) {
  Game.getGame().then(game => {
    Game.getRooms().then(rooms => {
      res.json(Object.assign({rooms: rooms}, game));
    });
  });
});

module.exports = router;
