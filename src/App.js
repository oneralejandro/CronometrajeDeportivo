// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardAdmin from './components/DashboardAdmin';
import EventoRegistro from './components/EventoRegistro';
import TomarTiempos from './components/TomarTiempos';
import TomaTiempoInicio from './components/TomaTiempoInicio';
import TomaTiempoFin from './components/TomaTiempoFin';
import FormularioRegistroCorredor from './components/FormularioRegistroCorredor';
import Resultadostiempos from './components/ResultadosTiempos'; // Importa Resultadostiempos

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/registro-evento" element={<EventoRegistro />} />
          <Route path="/tomar-tiempos" element={<TomarTiempos />} />
          <Route path="/tomar-tiempo-inicio" element={<TomaTiempoInicio />} />
          <Route path="/tomar-tiempo-fin" element={<TomaTiempoFin />} />
          <Route path="/registro-corredor" element={<FormularioRegistroCorredor />} />
          
          {/* Ruta para ver los resultados */}
          <Route path="/resultados" element={<Resultadostiempos />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
