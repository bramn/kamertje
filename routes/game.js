const express = require('express');
const router = express.Router();
const Game = require('../controllers/game.js');

router.get('/', async function (req, res) {
  let game = await Game.getGame();
  let rooms = await Game.getRooms();
  res.json(Object.assign({rooms: rooms}, game));
});

router.post('/reset', async function(req, res) {
  await Game.resetGame();
  await Game.resetRooms();
  req.app.io.emit('resetGame');
  res.redirect('/');
});

module.exports = router;
