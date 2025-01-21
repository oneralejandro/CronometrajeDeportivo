import React from 'react';
import { Link } from 'react-router-dom';

const TomarTiempos = () => {
  return (
    <div>
      <h2>Tomar Tiempos</h2>
      
      {/* Botón para tomar el tiempo de inicio */}
      <Link to="/tomar-tiempo-inicio">
        <button>Tomar Tiempo de Inicio</button>
      </Link>
      
      {/* Botón para tomar el tiempo final */}
      <Link to="/tomar-tiempo-fin">
        <button>Tomar Tiempo Final</button>
      </Link>
    </div>
  );
};

export default TomarTiempos;
