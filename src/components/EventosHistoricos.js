import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventosHistoricos = () => {
  const [resultados, setResultados] = useState([]);
  const [eventos, setEventos] = useState([]); // Estado para almacenar los eventos
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const [ordenarPorTiempo, setOrdenarPorTiempo] = useState(true); // Ordenar por tiempo

  // Cargar eventos y resultados al montar el componente
  useEffect(() => {
    // Obtener eventos disponibles para el filtro
    axios
      .get('http://localhost:5000/eventos') // Endpoint para obtener los eventos
      .then((response) => {
        setEventos(response.data); // Guardamos los eventos en el estado
      })
      .catch((error) => {
        console.error('Error al cargar los eventos:', error);
      });
  }, []);

  // Cargar los resultados al montar el componente o cuando cambie el evento o el orden
  useEffect(() => {
    let url = 'http://localhost:5000/resultados';
    if (eventoSeleccionado) {
      url += `?evento=${eventoSeleccionado}`;
    }

    axios
      .get(url)
      .then((response) => {
        const datos = response.data;
        // Ordenar los resultados por tiempo, de menor a mayor
        const ordenados = ordenarPorTiempo
          ? datos.sort((a, b) => {
              const tiempoA = a.tiempo_total.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
              const tiempoB = b.tiempo_total.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
              return tiempoA - tiempoB; // Orden ascendente
            })
          : datos;

        setResultados(ordenados); // Guardamos los resultados en el estado
      })
      .catch((error) => {
        console.error('Error al cargar los resultados:', error);
      });
  }, [eventoSeleccionado, ordenarPorTiempo]); // Dependemos del evento y el orden

  // Función para manejar el cambio en el filtro de evento
  const handleEventoChange = (e) => {
    setEventoSeleccionado(e.target.value);
  };

  // Función para manejar el cambio en el orden por tiempo
  const handleOrdenarTiempo = () => {
    setOrdenarPorTiempo(!ordenarPorTiempo); // Cambiar el orden
  };

  return (
    <div>
      <h1>Eventos Históricos</h1>

      {/* Filtro por evento */}
      <div>
        <label>Filtrar por evento: </label>
        <select value={eventoSeleccionado} onChange={handleEventoChange}>
          <option value="">Todos</option>
          {eventos.map((evento) => (
            <option key={evento.id_evento} value={evento.id_evento}>
              {evento.nombre_evento}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para ordenar por tiempo */}
      <div>
        <button onClick={handleOrdenarTiempo}>
          {ordenarPorTiempo ? 'Ordenar por tiempo (Mayor a menor)' : 'Ordenar por tiempo (Menor a mayor)'}
        </button>
      </div>

      {/* Tabla de resultados */}
      <table border="1">
        <thead>
          <tr>
            <th>Nombre Evento</th>
            <th>Nombre Usuario</th>
            <th>Posición</th>
            <th>Tiempo Total</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length === 0 ? (
            <tr>
              <td colSpan="5">No hay resultados para mostrar</td>
            </tr>
          ) : (
            resultados.map((resultado) => (
              <tr key={resultado.id_resultado}>
                <td>{resultado.nombre_evento}</td>
                <td>{resultado.nombre_usuario}</td>
                <td>{resultado.posicion}</td>
                <td>{resultado.tiempo_total}</td>
                <td>{resultado.categoria}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventosHistoricos;
