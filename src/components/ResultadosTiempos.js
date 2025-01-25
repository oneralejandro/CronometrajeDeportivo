import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioResultados = () => {
  const [categorias, setCategorias] = useState([]);  // Almacenar las categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');  // Almacenar categoría seleccionada
  const [resultados, setResultados] = useState([]);  // Almacenar resultados
  const [loading, setLoading] = useState(false);  // Estado de carga

  // Trae las categorías desde el backend
  useEffect(() => {
    axios.get('http://localhost:5000/get-categorias')  // Llama al endpoint de categorías
      .then(response => {
        setCategorias(response.data);  // Almacena las categorías en el estado
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
      });
  }, []);

  // Maneja el cambio en la selección de categoría
  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  // Obtiene los resultados filtrados por categoría
  const obtenerResultados = () => {
    setLoading(true);

    // Llamada a la API para obtener los resultados filtrados por categoría
    axios.get('http://localhost:5000/tiempos', {
      params: { categoria: categoriaSeleccionada }  // Envía la categoría seleccionada
    })
      .then(response => {
        setResultados(response.data);  // Almacena los resultados
        setLoading(false);  // Cambia el estado de carga
      })
      .catch(error => {
        console.error('Error al obtener los resultados:', error);
        setLoading(false);  // Cambia el estado de carga
      });
  };

  return (
    <div>
      <h1>Filtrar Resultados por Categoría</h1>

      {/* Filtro por categoría */}
      <div>
        <label htmlFor="categoria">Seleccionar Categoría: </label>
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={handleCategoriaChange}
        >
          <option value="">Todas</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria.categoria}>{categoria.categoria}</option> // Aquí accedemos correctamente al campo 'categoria'
          ))}
        </select>
        <button onClick={obtenerResultados}>Ver Resultados</button>
      </div>

      {/* Mostrar estado de carga */}
      {loading && <p>Cargando...</p>}

      {/* Tabla de resultados */}
      <table>
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre Usuario</th>
            <th>Hora Inicio</th>
            <th>Hora Meta</th>
            <th>Tiempo Total</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length > 0 ? (
            resultados.map((resultado, index) => (
              <tr key={index}>
                <td>{resultado.id_usuario}</td>
                <td>{resultado.nombre_usuario}</td>
                <td>{resultado.hora_inicio}</td>
                <td>{resultado.hora_meta || 'No disponible'}</td>
                <td>{resultado.tiempo_total || 'No disponible'}</td>
                <td>{resultado.categoria}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay resultados disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FormularioResultados;
