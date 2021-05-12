const mysql = require('mysql');
const loggerFactory = require('./logger');
const log = loggerFactory.getConvosoLogger({
  name: 'all' //passing stream name
});

function initDb() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'testuser',
    database: 'testdb'
  });

  connection.connect(function (err) {
    if (err) {
      log.error('error connecting: ' + err.stack);
      return;
    }

    log.info('connected as id ' + connection.threadId);
  });
}

initDb()