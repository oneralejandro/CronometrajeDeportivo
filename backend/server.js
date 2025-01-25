const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

connection.connect(err => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});