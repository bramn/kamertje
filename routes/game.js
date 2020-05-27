const express = require('express');
const router = express.Router();
const Game = require('../controllers/game.js');

router.get('/', async function (req, res) {
  let game = await Game.getGame()
  let rooms = await Game.getRooms()
  res.json(Object.assign({rooms: rooms}, game));
});

router.get('/destroy')

module.exports = router;
