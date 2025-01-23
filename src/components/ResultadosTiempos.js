
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioResultados = () => {
  const [categorias, setCategorias] = useState([]);  // almacenalas categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');  // a lmacenacategoria seleccionada
  const [resultados, setResultados] = useState([]);  // Almacena resultados
  const [loading, setLoading] = useState(false);  // estado de carga

  // traE categorias del servidor
  useEffect(() => {
    axios.get('http://localhost:5000/get-categorias')  // Llama endpoint que devuelve las categorias desde el backend
      .then(response => {
        setCategorias(response.data);  // Guardaaaaaaa
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
      });
  }, []);

  // Funcion selecciona  categoría
  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  // obtiene los resultados filtrados por categoria
  const obtenerResultados = () => {
    setLoading(true);

    // GET para obtener los resultados filtrados por categoria
    axios.get('http://localhost:5000/obtener-resultados', {
      params: { categoria: categoriaSeleccionada }
    })
      .then(response => {
        setResultados(response.data);  
        setLoading(false);  // Cambia  a falso
      })
      .catch(error => {
        console.error('Error al obtener los resultados:', error);
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Filtrar Resultados por Categoría</h1>

      <div>
        <label htmlFor="categoria">Seleccionar Categoría: </label>
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={handleCategoriaChange}
        >
          <option value="">Todas</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria}>{categoria}</option>
          ))}
        </select>
        <button onClick={obtenerResultados}>Ver Resultados</button>
      </div>

      {loading && <p>Cargando...</p>}

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
