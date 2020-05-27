var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kamertje',
  multipleStatements: true
})

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

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

const updateRoom = function (roomNumber, wall, playerColor) {
  // Which other possible wall do we also need to color?
  let otherRoomNumber = 0, otherWall, otherValues = [];

  switch (wall) {
    case 'top':
      otherRoomNumber = roomNumber - 3;
      otherWall = 'bottom';
      break;
    case 'right':
      if (roomNumber % 3 != 0)
        otherRoomNumber = roomNumber + 1;
      otherWall = 'left';
      break;
    case 'bottom':
      otherRoomNumber = roomNumber + 3;
      otherWall = 'top';
      break;
    case 'left':
      if (roomNumber % 3 != 1)
        otherRoomNumber = roomNumber - 1;
      otherWall = 'right';
      break;
  }
  if (otherRoomNumber > 0 && otherRoomNumber <= 9) {
    otherValues = [`${otherWall}Wall`, playerColor, otherRoomNumber]
  }

  let sql = "UPDATE rooms SET ?? = ? WHERE number = ?;"
  let values = [`${wall}Wall`, playerColor, roomNumber]
  let queries = mysql.format(sql, values);
  if (otherValues.length == 3)
    queries += mysql.format("UPDATE rooms SET ?? = ? WHERE number = ?", otherValues);

  return new Promise((resolve, reject) => {
    connection.query(queries, function (err, result) {
      if (err) {
        return reject(err)
      } else {
        console.log(result);
      }
    });
  });
}

module.exports = {
  getRooms,
  updateRoom
}
