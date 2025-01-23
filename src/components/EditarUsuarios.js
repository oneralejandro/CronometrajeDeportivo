
import React, { useState } from 'react';
import axios from 'axios';

const EditarUsuarios = () => {
  const [rut, setRut] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [nivelAcceso, setNivelAcceso] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // buscamos usuario por por rut
  const buscarUsuario = async () => {
    if (!rut) {
      setError('rut  obligatorio');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/usuarios/${rut}`);
      if (response.data) {
        setUsuario(response.data);
        setNombreCompleto(response.data.nombre_completo);
        setCorreo(response.data.correo);
        setNivelAcceso(response.data.nivel_acceso);
        setError('');
      }
    } catch (err) {
      setError('Error al buscar el usuario');
      setSuccessMessage('');
    }
  };

  // Actualizamos dato  usuario
  const actualizarUsuario = async (e) => {
    e.preventDefault();

    if (!nombreCompleto || !correo || !nivelAcceso) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/usuarios/${rut}`, {
        nombre_completo: nombreCompleto,
        correo: correo,
        nivel_acceso: nivelAcceso,
      });

      if (response.data) {
        setError('');
        setSuccessMessage('Usuario actualizado exitosamente');
        setUsuario(response.data); // Refresca datos
      }
    } catch (err) {
      setError('Error al actualizar el usuario');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Editar Usuario</h1>

  
      <div>
        <label htmlFor="rut">Buscar Usuario por Rut:</label>
        <input
          type="text"
          id="rut"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          placeholder="Ingrese el Rut del usuario"
        />
        <button onClick={buscarUsuario}>Buscar</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {usuario && (
        <form onSubmit={actualizarUsuario}>
          <div>
            <label htmlFor="nombre_completo">Nombre Completo:</label>
            <input
              type="text"
              id="nombre_completo"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nivel_acceso">Nivel de Acceso:</label>
            <select
              id="nivel_acceso"
              value={nivelAcceso}
              onChange={(e) => setNivelAcceso(e.target.value)}
            >
              <option value="1">Administrador</option>
              <option value="2">Deportista</option>
              <option value="3">Publico general</option>
            </select>
          </div>
          <button type="submit">Actualizar Usuario</button>
        </form>
      )}
    </div>
  );
};

export default EditarUsuarios;
