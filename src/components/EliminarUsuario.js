import React, { useState } from 'react';
import axios from 'axios';

const EliminarUsuario = () => {
  const [rut, setRut] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Manejocambio RUT
  const handleChange = (e) => {
    setRut(e.target.value);
  };

  // envio de formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validacion  RUT vacío
    if (!rut) {
      setMensaje('ingrese un RUT.');
      return;
    }

    // solicitud DELETE al backend 
    axios.delete(`http://localhost:5000/api/usuarios/${rut}`)
      .then((response) => {
        setMensaje(response.data.message);  
      })
      .catch((error) => {
        setMensaje(error.response ? error.response.data.message : 'Error al eliminar el usuario');
        console.error('Error al eliminar el usuario:', error);
      });
  };

  return (
    <div>
      <h2>Eliminar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>RUT</label>
          <input
            type="text"
            name="rut"
            value={rut}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Eliminar Usuario</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default EliminarUsuario;
