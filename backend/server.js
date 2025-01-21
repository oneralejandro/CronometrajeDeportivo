const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Importar CORS

const app = express();
const port = 5000;

app.use(cors());  // Habilitar CORS
app.use(express.json());  // Middleware para manejar el cuerpo en formato JSON

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bd_cronometraje',
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// ------------------------------------- Endpoint para niveles de acceso --------------------------------------

app.get('/niveles-acceso', (req, res) => {
  const query = 'SELECT * FROM niveles_acceso WHERE id_nivel_acceso <> 1'; // Muestra todos los niveles excepto el administrador (id_nivel_acceso = 1)
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los niveles de acceso');
    } else {
      res.json(results);
    }
  });
});

// ------------------------------------- Endpoint para registrar usuario --------------------------------------

app.post('/registrar-usuario', (req, res) => {
  const { nombre_usuario, contrasena, nombre_completo, correo, nivel_acceso, rut } = req.body;

  // La consulta SQL ahora incluye el campo `rut`
  const query = 'INSERT INTO usuarios (nombre_usuario, contrasena, nombre_completo, correo, nivel_acceso, rut) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [nombre_usuario, contrasena, nombre_completo, correo, nivel_acceso, rut], (err, result) => {
    if (err) {
      res.status(500).send('Error al registrar el usuario');
    } else {
      res.status(200).send('Usuario registrado con éxito');
    }
  });
});

// ------------------------------------- Endpoint para iniciar sesión --------------------------------------

app.post('/login', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?';
  
  db.query(query, [nombre_usuario, contrasena], (err, result) => {
    if (err) {
      res.status(500).send('Error al verificar las credenciales');
    } else if (result.length === 0) {
      res.status(401).send('Credenciales incorrectas');
    } else {
      // Enviar los datos del usuario, incluyendo el nivel de acceso
      const usuario = result[0];
      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        nivel_acceso: usuario.nivel_acceso, // Enviar el nivel de acceso
      });
    }
  });
});

// ------------------------------------- Endpoint para registrar evento --------------------------------------

app.post('/guardarEvento', (req, res) => {
  const { nombre_evento, fecha_evento, ubicacion_evento } = req.body;

  // Preparar la consulta SQL para insertar el evento
  const query = 'INSERT INTO eventos (nombre_evento, fecha_evento, ubicacion_evento) VALUES (?, ?, ?)';

  // Ejecutar la consulta
  db.query(query, [nombre_evento, fecha_evento, ubicacion_evento], (err, result) => {
    if (err) {
      console.error('Error al insertar evento:', err);
      return res.status(500).json({ success: false, message: 'Error al registrar evento' });
    }
    res.status(200).json({ success: true, message: 'Evento registrado exitosamente' });
  });
});

// ------------------------------------- Endpoint para obtener usuarios y tiempos --------------------------------------

app.get('/usuarios-y-tiempos', (req, res) => {
  const query = `
    SELECT u.id_usuario, u.nombre_usuario, u.nombre_completo, t.hora_inicio, t.hora_meta, t.tiempo_total
    FROM usuarios u
    JOIN tiempos t ON u.id_usuario = t.id_usuario
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los usuarios y tiempos');
    } else {
      res.json(results);  // Enviar los resultados al frontend
    }
  });
});

// ------------------------------------- Endpoint para obtener eventos --------------------------------------

app.get('/eventos', (req, res) => {
  const query = 'SELECT id_evento, nombre_evento FROM eventos';  // Seleccionamos los campos necesarios de la tabla eventos
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los eventos');
    }
    res.json(results);  // Devolvemos los eventos al frontend
  });
});

// ------------------------------------- Endpoint para registrar participación en el evento --------------------------------------

app.post('/registrar-evento', (req, res) => {
  const { rut, id_evento, estado_participacion, categoria } = req.body;  // Agregar el campo categoria

  // Paso 1: Buscar el id_usuario en la tabla usuarios usando el rut
  const queryBuscarUsuario = 'SELECT id_usuario FROM usuarios WHERE rut = ?';

  db.query(queryBuscarUsuario, [rut], (err, result) => {
    if (err) {
      return res.status(500).send('Error al buscar el usuario');
    }

    // Verificar si se encontró un usuario con ese rut
    if (result.length === 0) {
      return res.status(404).send('Usuario no encontrado, favor realizar registro en apartado "registro de usuarios"');
    }

    // Paso 2: Obtener el id_usuario
    const id_usuario = result[0].id_usuario;

    // Paso 3: Insertar en la tabla usuarios_eventos, ahora incluyendo el campo categoria
    const queryInsertarEvento = `
      INSERT INTO usuarios_eventos (id_usuario, id_evento, estado_participacion, categoria) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(queryInsertarEvento, [id_usuario, id_evento, estado_participacion, categoria], (err, result) => {
      if (err) {
        return res.status(500).send('Error al registrar la participación en el evento');
      }

      res.status(200).send('Participación registrada con éxito');
    });
  });
});

// ------------------------------------- Endpoint para guardar la hora de inicio --------------------------------------

app.post('/guardar-hora', (req, res) => {
  const { id_usuario, hora_inicio, id_evento } = req.body;

  // Paso 1: Obtener la categoría del usuario para el evento
  const queryCategoria = `
    SELECT categoria
    FROM usuarios_eventos
    WHERE id_usuario = ? AND id_evento = ?
  `;

  db.query(queryCategoria, [id_usuario, id_evento], (err, result) => {
    if (err) {
      console.error('Error al obtener la categoría:', err);
      return res.status(500).send('Error al obtener la categoría');
    }

    if (result.length === 0) {
      return res.status(404).send('No se encontró la categoría para este usuario y evento');
    }

    // Obtener la categoría del resultado
    const categoria = result[0].categoria;

    // Paso 2: Insertar en la tabla tiempos incluyendo la categoría
    const queryInsertarHora = `
      INSERT INTO tiempos (id_evento, id_usuario, hora_inicio, categoria_id)
      VALUES (?, ?, ?, ?)
    `;

    db.query(queryInsertarHora, [id_evento, id_usuario, hora_inicio, categoria], (err, result) => {
      if (err) {
        console.error('Error al guardar la hora:', err);
        return res.status(500).send('Error al guardar la hora');
      }
      res.status(200).send('Hora inicio carrera guardada con éxito');
    });
  });
});

// ------------------------------------- Endpoint para obtener usuarios_eventos con filtro por id_evento --------------------------------------

app.get('/usuarios_eventos', (req, res) => {
  const { id_evento } = req.query;  // Obtener el id_evento 

  let query = `
    SELECT ue.id_usuario_evento, ue.id_usuario, u.nombre_usuario, u.nombre_completo, u.correo, e.nombre_evento, 
           ue.estado_participacion, ue.categoria, ue.fecha_inscripcion
    FROM usuarios_eventos ue
    JOIN usuarios u ON ue.id_usuario = u.id_usuario
    JOIN eventos e ON ue.id_evento = e.id_evento
  `;

  if (id_evento) {
    query += ' WHERE ue.id_evento = ?';  // Filtro por id_evento si se proporciona
  }

  db.query(query, [id_evento], (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios y eventos');
    }
    res.json(results);  // Enviar los resultados al frontend
  });
});


// Endpoint para obtener usuarios con hora de inicio para un evento
app.get('/usuarios-con-hora-inicio', (req, res) => {
  const { id_evento } = req.query;

  const query = `
    SELECT u.id_usuario, u.nombre_usuario, u.nombre_completo, u.correo, t.hora_inicio
    FROM usuarios u
    JOIN tiempos t ON u.id_usuario = t.id_usuario
    WHERE t.id_evento = ? AND t.hora_inicio IS NOT NULL
  `;

  db.query(query, [id_evento], (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios con hora de inicio');
    }
    res.json(results);
  });
});


// ------------------------------------- Endpoint para actualizar hora_meta y tiempo_total --------------------------------------

app.put('/actualizar-hora-meta', (req, res) => {
  const { id_usuario, hora_meta, tiempo_total } = req.body;

  // Consulta para actualizar la hora_meta y tiempo_total en la tabla tiempos
  const query = `
    UPDATE tiempos 
    SET hora_meta = ?, tiempo_total = ? 
    WHERE id_usuario = ?
  `;

  db.query(query, [hora_meta, tiempo_total, id_usuario], (err, result) => {
    if (err) {
      console.error('Error al actualizar la hora_meta y tiempo_total:', err);
      return res.status(500).send('Error al actualizar los tiempos');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.status(200).send('Hora Meta y Tiempo Total actualizados con éxito');
  });
});




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
