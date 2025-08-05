// 🎯 COMPONENTE PRINCIPAL NUEVO - DESDE CERO
// Orquestador limpio sin contaminación

import React, { useState } from 'react';
import { RouletteWheelNew } from './RouletteWheelNew';
import { useRouletteNew } from '../hooks/useRouletteNew';
import { RouletteSectorNew } from '../types/rouletteNew';

interface RouletteNewProps {
  sectors: RouletteSectorNew[];
  onSpinComplete?: (result: any) => void;
  disabled?: boolean;
}

export const RouletteNew: React.FC<RouletteNewProps> = ({
  sectors,
  onSpinComplete,
  disabled = false
}) => {
  const { animation, lastResult, spin, reset } = useRouletteNew(sectors);
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
      setShowResult(true);
      
      if (onSpinComplete) {
        onSpinComplete(lastResult);
      }
    }
  }, [lastResult, animation.isSpinning, onSpinComplete]);

  const activeSectorsCount = sectors.filter(s => s.isActive).length;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Ruleta */}
      <div className="relative">
        <RouletteWheelNew
          sectors={sectors}
          animation={animation}
          width={400}
          height={400}
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
            {animation.isSpinning ? '🎰 Girando...' : '🎰 GIRAR RULETA'}
          </button>

          <button
            onClick={handleReset}
            disabled={animation.isSpinning}
            className="px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            🔄 Reset
          </button>
        </div>

        {/* Información */}
        <div className="text-center text-gray-600">
          <p>Sectores activos: {activeSectorsCount}</p>
          {activeSectorsCount === 0 && (
            <p className="text-red-500 font-medium">⚠️ Agrega al menos un sector activo</p>
          )}
        </div>
      </div>

      {/* Resultado */}
      {showResult && lastResult && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl shadow-lg border-2 border-green-300 text-center">
          <div className="text-2xl font-bold text-green-800 mb-2">
            🎉 ¡RESULTADO!
          </div>
          <div className="text-xl font-semibold text-gray-800">
            {lastResult.winnerSector.displayName}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {lastResult.winnerSector.isPrize ? '🏆 ¡Es un PREMIO!' : '😔 No es premio, sigue intentando'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {lastResult.timestamp.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};
