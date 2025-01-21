import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Obtener lista de eventos para el filtro
    axios.get('http://localhost:5000/eventos')
      .then(response => {
        setEventos(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los eventos:', error);
      });
  }, []);

  const handleEventoChange = (e) => {
    setSelectedEvento(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtener los usuarios del evento seleccionado
    axios.get(`http://localhost:5000/usuarios_eventos?id_evento=${selectedEvento}`)
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los usuarios:', error);
      });
  };

  // Función para manejar la grabación de la hora de inicio
  const guardarHora = (idUsuario) => {
    const horaInicio = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Formato YYYY-MM-DD HH:MM:SS
    
    axios.post('http://localhost:5000/guardar-hora', {
      id_usuario: idUsuario,
      hora_inicio: horaInicio,
      id_evento: selectedEvento,  // ID del evento seleccionado
    })
    .then(response => {
      alert('Hora inicio registrada con exito  !');
    })
    .catch(error => {
      console.error('Hubo un error al guardar la hora:', error);
    });
  };

  return (
    <div>
      <h1>Usuarios por Evento</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="evento">Seleccionar Evento:</label>
        <select id="evento" value={selectedEvento} onChange={handleEventoChange}>
          <option value="">Seleccione un evento</option>
          {eventos.map(evento => (
            <option key={evento.id_evento} value={evento.id_evento}>
              {evento.nombre_evento}
            </option>
          ))}
        </select>
        <button type="submit">Filtrar</button>
      </form>

      <h2>Usuarios Inscritos:</h2>
      <table>
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre Usuario</th>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Fecha Inscripcion</th>
            <th>Estado Participacion</th>
            <th>Categoria</th>
            <th>Tomar tiempo inicio</th> {/* Nueva columna para el botón */}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.nombre_completo}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.fecha_inscripcion}</td>
              <td>{usuario.estado_participacion}</td>
              <td>{usuario.categoria}</td>
              <td>
                <button onClick={() => guardarHora(usuario.id_usuario)}>Guardar Hora inicio</button> {/* Botón para guardar la hora */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
