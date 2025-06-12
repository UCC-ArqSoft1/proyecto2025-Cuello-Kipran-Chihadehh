// PaginaInicio.jsx
import React from 'react';
import './PaginaInicio.css';
import { useNavigate } from 'react-router-dom';

export default function PaginaInicio() {
  const navigate = useNavigate();

  return (
    <div className="pagina-inicio">
      <header className="hero">
        <div className="hero-content">
          <h1>EverLifting</h1>
          <p>Donde el esfuerzo se convierte en hábito</p>
          <button onClick={() => navigate('/login')}>Empezar</button>
        </div>
      </header>

      <section className="info">
        <h2>¿Quiénes somos?</h2>
        <p>
          En EverLifting creemos en el poder del entrenamiento disciplinado. Ofrecemos un espacio moderno,
          acompañado de entrenadores calificados y planes personalizados para que logres tus objetivos.
        </p>
      </section>

      <section className="servicios">
        <div className="servicio">
          <h3>Musculación</h3>
          <p>Entrenamiento de fuerza con máquinas y peso libre.</p>
        </div>
        <div className="servicio">
          <h3>Funcional</h3>
          <p>Clases dinámicas grupales para mejorar tu rendimiento general.</p>
        </div>
        <div className="servicio">
          <h3>Personalizado</h3>
          <p>Planes de entrenamiento diseñados a tu medida.</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 EverLifting. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
