import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TomaTiempoFin = () => {
  const [usuariosConHoraInicio, setUsuariosConHoraInicio] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // trae la lista de eventos para el filtro
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

    if (selectedEvento) {
      // Osolo muestra usuarios que ya tienen hora de inidio tomada
      axios.get(`http://localhost:5000/usuarios-con-hora-inicio?id_evento=${selectedEvento}`)
        .then(response => {
          setUsuariosConHoraInicio(response.data);
        })
        .catch(error => {
          console.error('Hubo un error al obtener los usuarios con hora de inicio:', error);
        });
    } else {
      alert('Por favor, selecciona un evento');
    }
  };

  // actualizaciopn de hora_meta y tiempo_total
  const guardarHoraFin = (idUsuario, horaInicio) => {
    const horaFin = new Date().toISOString().slice(0, 19).replace('T', ' '); //  YYYY-MM-DD HH:MM:SS
    const tiempoTotal = calcularTiempoTotal(horaInicio, horaFin);

    axios.put('http://localhost:5000/actualizar-hora-meta', {
      id_usuario: idUsuario,
      hora_meta: horaFin,
      tiempo_total: tiempoTotal,
    })
    .then(response => {
     
      setUsuariosConHoraInicio(prevUsuarios => {
        return prevUsuarios.map(usuario => 
          usuario.id_usuario === idUsuario 
            ? { ...usuario, hora_meta: horaFin, tiempo_total: tiempoTotal }
            : usuario
        );
      });
      alert('Hora de llegada a la meta y tiempo fial guardados con exito');
    })
    .catch(error => {
      console.error('error al guardar la hora de finalizacion:', error);
    });
  };

  // calcular el tiempo total (funcion)
  const calcularTiempoTotal = (horaInicio, horaFin) => {
    const inicio = new Date(horaInicio);
    const fin = new Date(horaFin);

    const diferencia = fin - inicio; // Diferencia en milisegundos
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Registrar Hora de Finalización y Tiempo Total</h1>
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

     
      <table>
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre Usuario</th>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Hora Inicio</th>
            <th>Hora Meta</th>
            <th>Tiempo Total</th>
            <th>Registrar hora llegada</th>
          </tr>
        </thead>
        <tbody>
          {usuariosConHoraInicio.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.nombre_completo}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.hora_inicio}</td>
              <td>{usuario.hora_meta || 'N/A'}</td>
              <td>{usuario.tiempo_total || 'N/A'}</td>
              <td>
                <button onClick={() => guardarHoraFin(usuario.id_usuario, usuario.hora_inicio)}>Registrar hora meta</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TomaTiempoFin;
