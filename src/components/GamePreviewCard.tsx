import React from 'react';

interface GamePreviewCardProps {
  title: string;
  icon: string;
  gradient: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

// Componente guardado para uso futuro - Tarjeta de preview de juegos
export const GamePreviewCard: React.FC<GamePreviewCardProps> = ({
  title,
  icon,
  gradient,
  description = "¡Crea experiencias únicas!",
  buttonText = "▶ CREAR AHORA",
  onButtonClick
}) => {
  return (
    <div className="relative">
      {/* Carrusel de juegos */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-1 transition-all duration-500">
        <div className={`w-full h-80 rounded-xl flex items-center justify-center transition-all duration-1000 bg-gradient-to-br ${gradient}`}>
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-title" style={{ letterSpacing: '-0.5px' }}>
              {title}
            </h3>
            <p className="text-gray-600">{description}</p>
            <button
              onClick={onButtonClick}
              className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-600 transition-colors cursor-pointer"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-3 rounded-full animate-bounce">
        🏆
      </div>
      <div className="absolute -bottom-4 -left-4 bg-green-400 text-white p-3 rounded-full animate-pulse">
        💎
      </div>
    </div>
  );
};
