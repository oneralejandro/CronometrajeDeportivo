const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  //CORS

const app = express();
const port = 5000;

app.use(cors());  // habilita CORS (habilitado)
app.use(express.json());  // middleware 

// Conexion base de datos
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

//  endpoint para mostrar niveles de acceso 

app.get('/niveles-acceso', (req, res) => {
  const query = 'SELECT * FROM niveles_acceso WHERE id_nivel_acceso <> 1'; // muestra todos los niveles menos administrador (id_nivel_acceso = 1)
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los niveles de acceso');
    } else {
      res.json(results);
    }
  });
});

//  endpoint para registrar usuarios 

app.post('/registrar-usuario', (req, res) => {
  const { nombre_usuario, contrasena, nombre_completo, correo, nivel_acceso, rut } = req.body;

  
  const query = 'INSERT INTO usuarios (nombre_usuario, contrasena, nombre_completo, correo, nivel_acceso, rut) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [nombre_usuario, contrasena, nombre_completo, correo, nivel_acceso, rut], (err, result) => {
    if (err) {
      res.status(500).send('Error al registrar el usuario');
    } else {
      res.status(200).send('Usuario registrado con éxito');
    }
  });
});

// endpoint para iniciar sesion

app.post('/login', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?';
  
  db.query(query, [nombre_usuario, contrasena], (err, result) => {
    if (err) {
      res.status(500).send('Error al verificar las credenciales');
    } else if (result.length === 0) {
      res.status(401).send('Credenciales incorrectas');
    } else {
      
      const usuario = result[0];// envia los datos incluyendo el nivel de acceso
      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        nivel_acceso: usuario.nivel_acceso, // envia el nivel de acceso
      });
    }
  });
});

//  endpoint para obtener usuario por rut 

app.get('/api/usuarios/:rut', (req, res) => {
  const { rut } = req.params;
  db.query('SELECT * FROM usuarios WHERE rut = ?', [rut], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos' });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// endpoint para actualizar usuarios

app.put('/api/usuarios/:rut', (req, res) => {
  const { rut } = req.params;
  const { nombre_completo, correo, nivel_acceso } = req.body;

  // Valida campos
  if (!nombre_completo || !correo || !nivel_acceso) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  db.query(
    'UPDATE usuarios SET nombre_completo = ?, correo = ?, nivel_acceso = ? WHERE rut = ?',
    [nombre_completo, correo, nivel_acceso, rut],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error en la base de datos' });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json({ message: 'Usuario actualizado correctamente' });
    }
  );
});

//endpoint registra evento

app.post('/guardarEvento', (req, res) => {
  const { nombre_evento, fecha_evento, ubicacion_evento } = req.body;

  
  const query = 'INSERT INTO eventos (nombre_evento, fecha_evento, ubicacion_evento) VALUES (?, ?, ?)';

  db.query(query, [nombre_evento, fecha_evento, ubicacion_evento], (err, result) => {
    if (err) {
      console.error('Error al insertar evento:', err);
      return res.status(500).json({ success: false, message: 'Error al registrar evento' });
    }
    res.status(200).json({ success: true, message: 'Evento registrado exitosamente' });
  });
});



// endpoint obtiene usuarios con hora de inicio para un evento
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

// Inicia el servidor IMPORTANTE ! NO MODIFICAR
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});


// endpoint obtiene eventos 

app.get('/eventos', (req, res) => {
  const query = 'SELECT id_evento, nombre_evento FROM eventos';  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los eventos');
    }
    res.json(results);  // devuelve  eventos al frontend
  });
});

//------------------------------endpoint elimina usuarios (no corredores) por rut

app.delete('/api/usuarios/:rut', (req, res) => {
  const { rut } = req.params;

  
  db.query('DELETE FROM usuarios WHERE rut = ?', [rut], (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  });
});


// endpoint para registrar usuario que participa en el evento s

app.post('/registrar-evento', (req, res) => {
  const { rut, id_evento, estado_participacion, categoria } = req.body;  // Agrega el campo categoria

  // primero busca el id_usuario en la tabla usuarios usando el rut
  const queryBuscarUsuario = 'SELECT id_usuario FROM usuarios WHERE rut = ?';

  db.query(queryBuscarUsuario, [rut], (err, result) => {
    if (err) {
      return res.status(500).send('Error al buscar el usuario');
    }

    if (result.length === 0) {
      return res.status(404).send('Usuario no encontrado, favor realizar registro en apartado "registro de usuarios"');
    }

    // segund obtiene el id_usuario
    const id_usuario = result[0].id_usuario;

    // tercer inserta en la tabla usuarios_eventos incluye el campo categoria
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









// endpoint para guardar la hora de inicio 

app.post('/guardar-hora', (req, res) => {
  const { id_usuario, hora_inicio, id_evento } = req.body;

  //  trae  categoría del usuario para el evento
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

    // trae categoría del resultado
    const categoria = result[0].categoria;

    // inserta datos en la tabla tiempos + la categoría
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

// endpoint obtiene usuarios_eventos con filtro por id_evento 

app.get('/usuarios_eventos', (req, res) => {
  const { id_evento } = req.query; 

  let query = `
    SELECT ue.id_usuario_evento, ue.id_usuario, u.nombre_usuario, u.nombre_completo, u.correo, e.nombre_evento, 
           ue.estado_participacion, ue.categoria, ue.fecha_inscripcion
    FROM usuarios_eventos ue
    JOIN usuarios u ON ue.id_usuario = u.id_usuario
    JOIN eventos e ON ue.id_evento = e.id_evento
  `;

  if (id_evento) {
    query += ' WHERE ue.id_evento = ?';  // filtra por id_evento 
  }

  db.query(query, [id_evento], (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios y eventos');
    }
    res.json(results);  //envia resultados
  });
});











//endpoint para obtener usuarios con hora de inicio para un evento
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


// endpoint q  actualiza hora_meta y tiempo_total 

app.put('/actualizar-hora-meta', (req, res) => {
  const { id_usuario, hora_meta, tiempo_total } = req.body;

  // query actualiza  hora_meta y tiempo_total en la tabla tiempos
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




// endpoint para obtener los tiempos filtrados por categoría y mostrar en formulario para el lado cliente

app.get('/tiempos', (req, res) => {
  const categoria = req.query.categoria || '';  // Usa 'categoria' para el parámetro de consulta
  const query = categoria
    ? `
        SELECT t.*, u.nombre_usuario, e.nombre_evento
        FROM tiempos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN eventos e ON t.id_evento = e.id_evento
        WHERE t.categoria_id = ?
      `
    : `
        SELECT t.*, u.nombre_usuario, e.nombre_evento
        FROM tiempos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN eventos e ON t.id_evento = e.id_evento
      `;
  
  db.query(query, [categoria], (err, result) => {
    if (err) {
      console.error('Error al obtener los tiempos:', err);
      return res.status(500).json({ message: 'Error al obtener los tiempos' });
    }
    console.log('Datos de tiempos con usuarios y eventos:', result); // Log para verificar qué datos se obtienen
    res.json(result);
  });
});





// Endpoint para obtener los resultados
app.get('/resultados', (req, res) => {
  const { evento } = req.query;
  let query = `
    SELECT 
      r.id_resultado, 
      r.posicion, 
      r.tiempo_total, 
      r.fecha_creacion,
      e.nombre_evento, 
      u.nombre_usuario, 
      ue.categoria
    FROM resultados r
    JOIN eventos e ON r.id_evento = e.id_evento
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    JOIN usuarios_eventos ue ON ue.id_usuario = u.id_usuario AND ue.id_evento = e.id_evento
  `;

  // Si se proporciona un evento, filtramos por evento
  if (evento) {
    query += ` WHERE e.id_evento = ${evento}`;
  }

  query += ' ORDER BY r.posicion';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los resultados:', err);
      return res.status(500).send('Error al obtener los resultados');
    }
    res.json(results); // Devolver los resultados como JSON
  });
});





// Endpoint para llenar la tabla resultados
app.post('/llenar-resultados', (req, res) => {
  // Consultar la tabla tiempos, usuarios, eventos
  const query = `
    SELECT t.id_tiempo, t.id_evento, t.id_usuario, t.tiempo_total, e.nombre_evento, u.nombre_usuario
    FROM tiempos t
    INNER JOIN eventos e ON t.id_evento = e.id_evento
    INNER JOIN usuarios u ON t.id_usuario = u.id_usuario
  `;

  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).json({ message: 'Error al obtener los datos' });
    }

    // Insertar los datos obtenidos en la tabla resultados
    let insertQuery = 'INSERT INTO resultados (id_evento, id_usuario, posicion, tiempo_total) VALUES ?';
    const values = resultados.map((resultado, index) => [
      resultado.id_evento,
      resultado.id_usuario,
      index + 1,  // Asumiendo que la posición es el índice de la lista
      resultado.tiempo_total
    ]);

    db.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error('Error al insertar en la tabla resultados:', err);
        return res.status(500).json({ message: 'Error al insertar en la tabla resultados' });
      }
      res.status(200).json({ message: 'Resultados insertados correctamente' });
    });
  });
});






// Endpoint para obtener los tiempos filtrados por categoría
app.get('/tiempos', (req, res) => {
  const categoria = req.query.categoria || '';  // Usamos 'categoria' para el parámetro de consulta
  const query = categoria
    ? `
        SELECT t.*, u.nombre_usuario, e.nombre_evento
        FROM tiempos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN eventos e ON t.id_evento = e.id_evento
        WHERE t.categoria_id = ?  // Filtro por categoría
      `
    : `
        SELECT t.*, u.nombre_usuario, e.nombre_evento
        FROM tiempos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN eventos e ON t.id_evento = e.id_evento
      `;
  
  db.query(query, [categoria], (err, result) => {
    if (err) {
      console.error('Error al obtener los tiempos:', err);
      return res.status(500).json({ message: 'Error al obtener los tiempos' });
    }
    res.json(result);  // Devuelve los resultados al frontend
  });
});


// Endpoint para obtener las categorías disponibles
app.get('/get-categorias', (req, res) => {
  const query = 'SELECT DISTINCT categoria FROM usuarios_eventos';  // Obtener categorías únicas
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener las categorías');
    }
    res.json(results);  // Devuelve las categorías al frontend
  });
});


// Endpoint para obtener los tiempos filtrados por categoría
app.get('/tiempos', (req, res) => {
  const categoria = req.query.categoria || '';  // Usamos 'categoria' para el parámetro de consulta
  const query = categoria
    ? `
        SELECT t.*, u.nombre_usuario, e.nombre_evento
        FROM tiempos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN eventos e ON t.id_evento = e.id_evento
        WHERE t.categoria = ?  // Filtro por la categoría seleccionada
      `
    : `
        SELECT t.*, u.nombre_usuario, e.nombre_evento
        FROM tiempos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN eventos e ON t.id_evento = e.id_evento
      `;
  
  db.query(query, [categoria], (err, result) => {
    if (err) {
      console.error('Error al obtener los tiempos:', err);
      return res.status(500).json({ message: 'Error al obtener los tiempos' });
    }
    res.json(result);  // Devuelve los resultados al frontend
  });
});
