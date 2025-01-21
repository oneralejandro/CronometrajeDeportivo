import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import FormularioRegistro from './FormularioRegistro'; // Importa el componente de registro

const Login = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Estado para saber si mostrar el formulario de registro

  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enviar los datos del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');  // Limpiar cualquier error previo

    try {
      // Aquí deberías cambiar la URL al endpoint de tu backend
      const response = await axios.post('http://localhost:5000/login', formData);

      // Verifica si el nivel de acceso está presente
      if (response.data && response.data.nivel_acceso !== undefined) {
        const { nivel_acceso } = response.data; // Obtén el nivel de acceso de la respuesta

        alert('Inicio de sesión exitoso');

        if (nivel_acceso === 1) {
          navigate('/dashboardAdmin');  // Redirigir al dashboard Admin
        } else if (nivel_acceso === 2 || nivel_acceso === 3) {
          navigate('/dashboard');  // Redirigir al dashboard normal
        } else {
          setError('Nivel de acceso no válido');
        }
      } else {
        setError('Error en los datos recibidos del servidor');
      }
    } catch (err) {
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  // Alternar entre mostrar login y registro
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div>
      {isRegistering ? (
        // Si está en el estado de registro, mostrar el formulario de registro
        <FormularioRegistro />
      ) : (
        <div>
          <h2>Iniciar sesión</h2>
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

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div>
            <span>No tienes cuenta? </span>
            <button onClick={toggleForm}>Registrarse</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
