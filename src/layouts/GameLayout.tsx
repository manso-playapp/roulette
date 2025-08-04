import React from 'react';
import { Outlet } from 'react-router-dom';

// Layout para juegos públicos - Pantalla completa, sin distracciones
const GameLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Contenido del juego en pantalla completa */}
      <main className="h-screen">
        <Outlet />
      </main>
      
      {/* Branding sutil en la esquina */}
      <div className="absolute bottom-4 right-4 text-white/30 text-xs">
        <span>Powered by PlayApp</span>
      </div>
    </div>
  );
};

export default GameLayout;
