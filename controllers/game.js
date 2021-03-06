const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kamertje',
  multipleStatements: true
})

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  }
});

const getGame = function () {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM games', function (err, rows) {
      if (err) {
        return reject(err)
      } else {
        resolve(rows[0])
      }
    });
  });
}

const resetGame = function () {
  return new Promise((resolve, reject) => {
    let query = mysql.format('UPDATE games SET current_player = ?, player_one = ?, player_two = ?', [null, null, null])

    connection.query(query, function (err, rows) {
      if (err) {
        return reject(err)
      } else {
        resolve(rows)
      }
    });
  });
};

const resetRooms = function () {
  return new Promise((resolve, reject) => {
    let query = mysql.format('UPDATE rooms SET rightWall=?, topWall=?, bottomWall=?, leftWall=?', [null, null, null, null])

    connection.query(query, function (err, rows) {
      if (err) {
        return reject(err)
      } else {
        resolve(rows)
      }
    });
  });
};

const getRooms = function () {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM rooms', function (err, rows, fields) {
      if (err) {
        return reject(err)
      } else {
        resolve(rows)
      }
    });
  });
}

const updateGamePlayers = function (player) {
  return new Promise((resolve, reject) => {
    let otherPlayer = (player == 'red') ? 'blue' : 'red';
    let query = mysql.format('UPDATE games SET current_player = ?, player_one = ?, player_two = ?', [player, player, otherPlayer])

    connection.query(query, function (err, rows) {
      if (err) {
        return reject(err)
      } else {
        resolve(rows)
      }
    });
  });
};

const updateCurrentPlayer = function (player) {
  return new Promise((resolve, reject) => {
    let query = mysql.format('UPDATE games SET current_player = ?', [player])

    connection.query(query, function (err, results) {
      if (err) {
        return reject(err)
      } else {
        resolve(results)
      }
    });
  });
}

const updateRoom = function (values) {
  // Which other possible wall do we also need to color?
  let otherRoomNumber = 0, otherWall, otherValues = {};

  switch (values.wall) {
    case 'topWall':
      otherRoomNumber = values.number - 3;
      otherWall = 'bottomWall';
      break;
    case 'rightWall':
      if (values.number % 3 !== 0)
        otherRoomNumber = values.number + 1;
      otherWall = 'leftWall';
      break;
    case 'bottomWall':
      otherRoomNumber = values.number + 3;
      otherWall = 'topWall';
      break;
    case 'leftWall':
      if (values.number % 3 !== 1)
        otherRoomNumber = values.number - 1;
      otherWall = 'rightWall';
      break;
  }
  if (otherRoomNumber > 0 && otherRoomNumber <= 9) {
    otherValues = {
      wall: otherWall,
      playerColor: values.playerColor,
      number: otherRoomNumber
    }
  }

  let sql = "UPDATE rooms SET ?? = ? WHERE number = ?;"
  let queries = mysql.format(sql, [values.wall, values.playerColor, values.number]);
  if (Object.keys(otherValues).length === 3)
    queries += mysql.format(sql, [otherValues.wall, otherValues.playerColor, otherValues.number]);

  return new Promise((resolve, reject) => {
    connection.query(queries, function (err) {
      if (err) {
        return reject(err)
      } else {
        resolve(otherValues)
      }
    });
  });
}

module.exports = {
  getGame,
  getRooms,
  resetGame,
  resetRooms,
  updateRoom,
  updateGamePlayers,
  updateCurrentPlayer
}
