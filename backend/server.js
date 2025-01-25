const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS
app.use(cors());
app.use(express.json());  // middleware para procesar JSON

// Obtener la URL de la base de datos desde las variables de entorno (en Heroku)
const dbUrl = process.env.JAWSDB_MARIA_URL;

// Si estamos en Heroku, usar la URL de la base de datos de JawsDB
// Si estamos en desarrollo local, conectar a la base de datos local
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

// Endpoint para login (solo un ejemplo, ajusta según tu modelo de base de datos)
app.post('/login', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?';
  
  db.query(query, [nombre_usuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos: ', err);
      return res.status(500).json({ error: 'Error en la consulta de la base de datos' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Suponiendo que en la base de datos hay un campo `nivel_acceso`
    const { nivel_acceso } = results[0];

    res.json({ nivel_acceso });
  });
});

// Endpoint de ejemplo para obtener niveles de acceso
app.get('/niveles-acceso', (req, res) => {
  const query = 'SELECT * FROM niveles_acceso WHERE id_nivel_acceso <> 1';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los niveles de acceso');
    }

    res.json(results);
  });
});

// Otros endpoints que necesites agregar

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
