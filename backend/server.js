const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS y procesar JSON
app.use(cors());
app.use(express.json());  // middleware para procesar JSON

// Obtener la URL de la base de datos desde las variables de entorno (en Heroku)
const dbUrl = process.env.JAWSDB_MARIA_URL;

// Si no estás en Heroku (por ejemplo, en desarrollo local), usar una configuración local
const db = mysql.createConnection(dbUrl || {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bd_cronometraje',
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Endpoint para obtener niveles de acceso
app.get('/niveles-acceso', (req, res) => {
  const query = 'SELECT * FROM niveles_acceso WHERE id_nivel_acceso <> 1';  // Excluyendo admin
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los niveles de acceso');
    } else {
      res.json(results);
    }
  });
});

// Otros endpoints según tu código...


// Endpoint para verificar la conexión con la base de datos
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al conectar con la base de datos', error: err });
    }
    res.status(200).json({ message: 'Conexión exitosa a la base de datos', result: results[0].result });
  });
});


// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
