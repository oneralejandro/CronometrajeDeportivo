
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  return (
    <div>
      <h1>Dashboard Administrador</h1>

      
      <Link to="/registro-evento">
        <button>Agregar Evento</button>
      </Link>
      <Link to="/registro-corredor">
        <button>Registrar Corredor a evento</button>
      </Link>
      <Link to="/editar-corredor">
        <button>Editar Corredor</button>
      </Link>
      <Link to="/eliminar-corredor">
        <button>Eliminar Corredor</button>
      </Link>
      <Link to="/tomar-tiempos">
        <button>Tomar Tiempos</button>
      </Link>
      <Link to="/resultados">
        <button>Ver Resultados</button>
      </Link>
      
      
      <Link to="/editar-usuarios">
        <button>Editar Usuarios</button>
      </Link>
      <Link to="/eliminar-usuario">
        <button>Eliminar Usuario</button>
      </Link>
    </div>
  );
};

export default DashboardAdmin;
