import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistroEvento = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias] = useState([
    'Infantil', 'Junior', 'Damas', 'Rigido', 'Experto', 'Profesional', 'Elite'
  ]);
  const [formData, setFormData] = useState({
    rut: '',
    id_evento: '',
    estado_participacion: 'Inscrito', // Estado predeterminado
    categoria: '', // Campo de categoría
  });
  const [mensaje, setMensaje] = useState('');

  // Cargar los eventos al montar el componente
  useEffect(() => {
    axios.get('http://localhost:5000/eventos')
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar los eventos:', error);
      });
  }, []);

  // Manejar el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que el RUT no esté vacío
    if (!formData.rut) {
      setMensaje('Por favor, ingrese un RUT.');
      return;
    }

    // Validar que se haya seleccionado un evento
    if (!formData.id_evento) {
      setMensaje('Por favor, seleccione un evento.');
      return;
    }

    // Validar que se haya seleccionado una categoría
    if (!formData.categoria) {
      setMensaje('Por favor, seleccione una categoría.');
      return;
    }

    // Enviar los datos al backend
    axios.post('http://localhost:5000/registrar-evento', formData)
      .then((response) => {
        setMensaje('Corredor registrado con exito');
      })
      .catch((error) => {
        setMensaje(error.response ? error.response.data : 'Error al registrar participación');
        console.error('Error al registrar participación:', error);
      });
  };

  return (
    <div>
      <h2>Registro de corredor en Evento</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Evento</label>
          <select
            name="id_evento"
            value={formData.id_evento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un evento</option>
            {eventos.map((evento) => (
              <option key={evento.id_evento} value={evento.id_evento}>
                {evento.nombre_evento}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Estado de del registro</label>
          <select
            name="estado_participacion"
            value={formData.estado_participacion}
            onChange={handleChange}
          >
            <option value="Inscrito">Inscrito</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div>
          <label>Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Registrar Corredor</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default RegistroEvento;
