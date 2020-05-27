var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kamertje'
})

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

const getRooms = function () {
  return new Promise((resolve, reject) =>  {
    connection.query('SELECT * FROM rooms', function (err, rows, fields) {
      if (err) {
        return reject(err)
      } else {
        resolve(rows)
      }
    });
  });
}

const updateRoom = function(roomNumber, wall) {
  return new Promise((resolve, reject) =>  {
    const sql = `UPDATE rooms SET ${wall}Wall='iets' WHERE number = ${roomNumber}`;
    connection.query(sql, function (err, result) {
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
