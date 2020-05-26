var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kamertje'
})

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


var getRooms = function() {
  connection.query('SELECT * FROM rooms', function (err, rows, fields) {
    console.log(rows);
  });
}

module.exports = {
  getRooms
}

