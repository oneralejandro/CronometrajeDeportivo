import React, { useState } from 'react';
import '../Styles/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate



import FormularioRegistro from './FormularioRegistro'; //componente de registro

const Login = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // para saber si mostrar el formulario de registro

  const navigate = useNavigate(); // usamos useNavigate para redirigir

  // maenjo de los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // enviar los datos 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');  // Limpima todos los errores anteriores

    try {
      const response = await axios.post('http://localhost:5000/login', formData);


      if (response.data && response.data.nivel_acceso !== undefined) {
        const { nivel_acceso } = response.data; 

        alert('Inicio de sesión exitoso');

        if (nivel_acceso === 1) {
          navigate('/dashboardAdmin');  // redirige al dashboardAdmin
        } else if (nivel_acceso === 2 || nivel_acceso === 3) {
          navigate('/dashboard');  // redirige al dashboard
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

  // para  mostrar login o registro
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div>
      {isRegistering ? (
  
        <FormularioRegistro />
      ) : (
        <div>
          <h2>Iniciar sesión test</h2>
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
