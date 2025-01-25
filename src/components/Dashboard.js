import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importamos Link para manejar la navegación

const Dashboard = () => {
  const [tiempos, setTiempos] = useState([]);
  const [categorias] = useState([
    'Infantil', 'Junior', 'Damas', 'Rigido', 'Experto', 'Profesional', 'Elite'
  ]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [message, setMessage] = useState('');

  // Cargar los tiempos al montar el componente o cuando cambie la categoría
  useEffect(() => {
    axios
      .get(`http://localhost:5000/tiempos?categoria=${categoriaSeleccionada}`)
      .then((response) => {
        setTiempos(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar los tiempos:', error);
      });
  }, [categoriaSeleccionada]);

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  // Función para llenar los resultados
  const llenarResultados = () => {
    axios
      .post('http://localhost:5000/llenar-resultados')
      .then((response) => {
        setMessage(response.data.message); // Mostrar mensaje de éxito
      })
      .catch((error) => {
        console.error('Error al llenar los resultados:', error);
        setMessage('Hubo un error al llenar los resultados');
      });
  };

  return (
    <div>
      <h1>Dashboard Deportista o Público</h1>

      {/* Filtro por categoría */}
      <div>
        <label>Filtrar por categoría: </label>
        <select value={categoriaSeleccionada} onChange={handleCategoriaChange}>
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de tiempos */}
      <table border="1">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre Usuario</th>
            <th>Nombre Evento</th>
            <th>Tiempo Total</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {tiempos.length === 0 ? (
            <tr>
              <td colSpan="5">No hay datos para mostrar</td>
            </tr>
          ) : (
            tiempos.map((tiempo) => (
              <tr key={tiempo.id_tiempo}>
                <td>{tiempo.rut}</td> {/* Suponiendo que 'rut' es el campo en la tabla usuarios */}
                <td>{tiempo.nombre_usuario}</td> {/* Nombre del usuario de la tabla usuarios */}
                <td>{tiempo.nombre_evento}</td> {/* Nombre del evento de la tabla eventos */}
                <td>{tiempo.tiempo_total}</td>
                <td>{tiempo.categoria_id}</td> {/* Se muestra 'categoria_id' */}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Botón para llenar los resultados en la base de datos */}
      <div>
        <button onClick={llenarResultados}>Llenar Resultados</button>
        {message && <p>{message}</p>}
      </div>

      {/* Botón para redirigir a la página de eventos históricos */}
      <div>
        <Link to="/eventos-historicos">
          <button>Eventos Históricos</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
