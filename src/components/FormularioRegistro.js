import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistroUsuario = () => {
  const [nivelesAcceso, setNivelesAcceso] = useState([]);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
    nombre_completo: '',
    correo: '',
    nivel_acceso: '',
    rut: '', 
  });

  // Carga niveles de acceso desde la endpoint
  useEffect(() => {
    axios.get('http://localhost:5000/niveles-acceso')
      .then((response) => {
        setNivelesAcceso(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar los niveles de acceso:', error);
      });
  }, []);

  // Manejo de  cambio de los campos del formulario de registro
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // envio del formulario de registro
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/registrar-usuario', formData)
      .then((response) => {
        alert('Usuario registrado con éxito');
        setFormData({
          nombre_usuario: '',
          contrasena: '',
          nombre_completo: '',
          correo: '',
          nivel_acceso: '',
          rut: '', 
        });
      })
      .catch((error) => {
        alert('Error al registrar el usuario');
        console.error('Error al registrar el usuario:', error);
      });
  };

  return (
    <div>
      <h2>Registro de Usuario Nuevo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>RUT</label>
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nivel de acceso</label>
          <select
            name="nivel_acceso"
            value={formData.nivel_acceso}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un nivel de acceso</option>
            {nivelesAcceso.map((nivel) => (
              <option key={nivel.id_nivel_acceso} value={nivel.id_nivel_acceso}>
                {nivel.nivel_acceso}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
