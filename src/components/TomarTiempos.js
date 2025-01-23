import React from 'react';
import { Link } from 'react-router-dom';

const TomarTiempos = () => {
  return (
    <div>
      <h2>Tomar Tiempos</h2>
      
    
      <Link to="/tomar-tiempo-inicio">
        <button>Tomar Tiempo de Inicio</button>
      </Link>
      
  
      <Link to="/tomar-tiempo-fin">
        <button>Tomar Tiempo Final</button>
      </Link>
    </div>
  );
};

export default TomarTiempos;
