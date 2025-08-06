// 🎯 COMPONENTE RULETA AVANZADA COMPLETA
// Versión avanzada con configuración visual y funcionalidad de giro

import React from 'react';
import { RouletteSectorNew } from '../types/rouletteNew';
import { RouletteVisualConfig } from '../types/rouletteVisual';
import { RouletteWheelAdvanced } from './RouletteWheelAdvanced';
import { useRouletteAdvanced } from '../hooks/useRouletteAdvanced';

interface RouletteAdvancedProps {
  sectors: RouletteSectorNew[];
  visualConfig?: Partial<RouletteVisualConfig>;
  onSpinComplete?: (result: any) => void;
  size?: number;
  preset?: 'modern' | 'classic' | 'neon' | 'minimal';
  showControls?: boolean;
}

export const RouletteAdvanced: React.FC<RouletteAdvancedProps> = ({
  sectors,
  visualConfig = {},
  onSpinComplete,
  size = 400,
  preset = 'modern',
  showControls = true
}) => {
  const { currentAngle, isSpinning, spin, setAngle } = useRouletteAdvanced({
    sectors,
    visualConfig,
    onSpinComplete
  });

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Ruleta */}
      <div className="relative">
        <RouletteWheelAdvanced
          sectors={sectors}
          currentAngle={currentAngle}
          size={size}
          visualConfig={visualConfig}
          preset={preset}
        />
        
        {/* Overlay de carga durante el giro */}
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-full">
            <div className="text-white font-bold text-lg">
              🎯 Girando...
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      {showControls && (
        <div className="flex flex-col items-center space-y-4">
          {/* Botón principal de giro */}
          <button
            onClick={spin}
            disabled={isSpinning || sectors.length === 0}
            className={`px-8 py-4 rounded-lg font-bold text-xl transition-all transform ${
              isSpinning || sectors.length === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSpinning ? '🎯 Girando...' : '🎮 GIRAR RULETA'}
          </button>

          {/* Controles de testing (solo en desarrollo) */}
          <div className="flex space-x-2">
            <button
              onClick={() => setAngle(currentAngle + 45)}
              disabled={isSpinning}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
            >
              ↻ +45°
            </button>
            <button
              onClick={() => setAngle(0)}
              disabled={isSpinning}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
            >
              🔄 Reset
            </button>
          </div>

          {/* Información del estado */}
          <div className="text-center text-sm text-gray-600">
            <div>Ángulo actual: {Math.round(currentAngle)}°</div>
            <div>Sectores activos: {sectors.filter(s => s.isActive).length}</div>
            <div>
              Preset: <span className="font-medium capitalize">{preset}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay sectores */}
      {sectors.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">🎯</div>
          <div className="font-medium">No hay sectores configurados</div>
          <div className="text-sm">Agrega sectores para usar la ruleta</div>
        </div>
      )}
    </div>
  );
};
