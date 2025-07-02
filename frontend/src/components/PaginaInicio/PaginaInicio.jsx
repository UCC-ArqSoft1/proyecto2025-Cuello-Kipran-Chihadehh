// PaginaInicio.jsx
import React from 'react';
import './PaginaInicio.css';
import { useNavigate } from 'react-router-dom';

export default function PaginaInicio() {
  const navigate = useNavigate();

  return (
    <div className="pagina-inicio">
      <header className="hero">
        <div className="overlay">
          <div className="hero-content">
            <h1>EverLifting</h1>
            <p>Donde el esfuerzo se convierte en hábito</p>
            <button onClick={() => navigate('/login')}>Empezar</button>
          </div>
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
          <img
             src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
             alt="Musculación"
          />
          <div>
            <h3>Musculación</h3>
            <p>Entrenamiento de fuerza con máquinas y peso libre.</p>
          </div>
        </div>
        <div className="servicio">
          <img
            src="https://images.unsplash.com/photo-1734188341701-5a0b7575efbe?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Funcional"
          />
          <div>
            <h3>Funcional</h3>
            <p>Clases dinámicas grupales para mejorar tu rendimiento general.</p>
          </div>
        </div>
        <div className="servicio">
          <img
            src="https://images.unsplash.com/photo-1738523686878-e63f7d95dabf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Entrenamiento Personalizado"
          />
          <div>
            <h3>Personalizado</h3>
            <p>Planes de entrenamiento diseñados a tu medida.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 EverLifting. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
