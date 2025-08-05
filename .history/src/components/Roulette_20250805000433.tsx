import React, { useState } from 'react';
import { RouletteWheel } from './RouletteWheel';
import { useRoulette } from '../hooks/useRoulette';
import { RouletteSector, RouletteVisualConfig } from '../types/roulette';

interface RouletteProps {
  sectors: RouletteSector[];
  onSpinComplete?: (result: { winner: RouletteSector | null; angle: number }) => void;
  visualConfig?: Partial<RouletteVisualConfig>;
  disabled?: boolean;
}

const defaultVisualConfig: RouletteVisualConfig = {
  width: 400,
  height: 400,
  centerRadius: 30,
  borderWidth: 10,
  showLabels: true,
  fontSize: 14,
  fontFamily: 'Arial, sans-serif',
  defaultFontFamily: 'Arial, sans-serif',
  defaultFontSize: 14,
  defaultTextColor: '#FFFFFF',
  antiAliasing: true,
  quality: 'medium'
};

export const Roulette: React.FC<RouletteProps> = ({
  sectors,
  onSpinComplete,
  visualConfig: customVisualConfig = {},
  disabled = false
}) => {
  const visualConfig = { ...defaultVisualConfig, ...customVisualConfig };
  const { animation, lastResult, spin, reset, calculateWinner } = useRoulette(sectors);

  const [showResult, setShowResult] = useState(false);

  const handleSpin = () => {
    if (disabled || animation.isSpinning) return;
    
    setShowResult(false);
    spin();
  };

  const handleReset = () => {
    reset();
    setShowResult(false);
  };

  // Mostrar resultado cuando termine la animación
  React.useEffect(() => {
    if (lastResult && !animation.isSpinning) {
      const winner = calculateWinner(lastResult.finalAngle);
      setShowResult(true);
      
      if (onSpinComplete) {
        onSpinComplete({
          winner,
          angle: lastResult.finalAngle
        });
      }
    }
  }, [lastResult, animation.isSpinning, calculateWinner, onSpinComplete]);

  const activeSectorsCount = sectors.filter(s => s.isActive).length;
  const winner = lastResult ? calculateWinner(lastResult.finalAngle) : null;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Ruleta */}
      <div className="relative">
        <RouletteWheel
          sectors={sectors}
          animation={animation}
        />
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={handleSpin}
            disabled={disabled || animation.isSpinning || activeSectorsCount === 0}
            className={`
              px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 min-w-[200px]
              ${animation.isSpinning || activeSectorsCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 transform hover:scale-110 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {animation.isSpinning ? '🎰 Girando...' : '� ¡GIRAR RULETA!'}
          </button>

          {(lastResult || animation.currentAngle > 0) && (
            <button
              onClick={handleReset}
              disabled={animation.isSpinning}
              className="px-8 py-4 rounded-xl font-medium text-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 min-w-[150px]"
            >
              🔄 Resetear
            </button>
          )}
        </div>

        {/* Estado */}
        <div className="text-center">
          {activeSectorsCount === 0 && (
            <p className="text-red-500 text-sm">⚠️ No hay sectores activos</p>
          )}
          
          {activeSectorsCount > 0 && !animation.isSpinning && !showResult && (
            <p className="text-gray-600 text-sm">
              Ruleta lista • {activeSectorsCount} premio{activeSectorsCount !== 1 ? 's' : ''} disponible{activeSectorsCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Resultado */}
      {showResult && winner && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl border-2 border-purple-200 text-center max-w-md">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">¡Felicitaciones!</h3>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: winner.color }}
            ></div>
            <span className="text-lg font-semibold text-gray-800">
              {winner.label}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Resultado: {lastResult ? Math.round(lastResult.finalAngle) : 0}° • {lastResult ? new Date(lastResult.timestamp).toLocaleTimeString() : ''}
          </p>
        </div>
      )}

      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 text-center max-w-md">
          <p>Debug: Ángulo actual: {Math.round(animation.currentAngle)}°</p>
          <p>Sectores activos: {activeSectorsCount}</p>
          {lastResult && <p>Último resultado: {Math.round(lastResult.finalAngle)}°</p>}
        </div>
      )}
    </div>
  );
};
