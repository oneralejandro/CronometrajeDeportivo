
import React, { useState } from 'react';

const EventoRegistro = () => {
  const [nombreEvento, setNombreEvento] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Creamos el objeto con los datos del formulario
    const eventoData = {
      nombre_evento: nombreEvento,
      fecha_evento: fechaEvento,
      ubicacion_evento: ubicacionEvento,
    };

    // datos al servidor con fetch
    fetch('http://localhost:5000/guardarEvento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventoData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMensaje('Evento registrado exitosamente');
        } else {
          setMensaje('Error registrar al evento');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMensaje('Error en la solicitud');
      });
  };

  return (
    <div>
      <h2>Registrar Evento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Evento</label>
          <input
            type="text"
            value={nombreEvento}
            onChange={(e) => setNombreEvento(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha del Evento</label>
          <input
            type="date"
            value={fechaEvento}
            onChange={(e) => setFechaEvento(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ubicación del Evento</label>
          <input
            type="text"
            value={ubicacionEvento}
            onChange={(e) => setUbicacionEvento(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar Evento</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default EventoRegistro;
