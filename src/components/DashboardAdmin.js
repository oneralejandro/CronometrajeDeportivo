// DashboardAdmin.js
import React from 'react';
import { Link } from 'react-router-dom';  // Importa Link desde React Router

const DashboardAdmin = () => {
  return (
    <div>
      <h1>Dashboard Administrador</h1>

      {/* Enlaces a otras rutas */}
      <Link to="/registro-evento">
        <button>Agregar Evento</button>
      </Link>
      <Link to="/registro-corredor">
        <button>Registrar Corredor</button>
      </Link>
      <Link to="/tomar-tiempos">
        <button>Tomar Tiempos</button>
      </Link>
      
      {/* Nuevo botón "Ver Resultados" */}
      <Link to="/resultados">
        <button>Ver Resultados</button>
      </Link>
    </div>
  );
};

export default DashboardAdmin;
