import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RouletteConfigPanel } from '../../components/RouletteConfigPanel';
import { RouletteWheel } from '../../components/RouletteWheel';
import { useRoulette } from '../../hooks/useRoulette';
import { RouletteConfig, RouletteAnimation, ProbabilityDistribution } from '../../types/roulette';
import { DemoNavigation } from '../../components/DemoNavigation';

export const RouletteAdvancedConfigPage: React.FC = () => {
  const [config, setConfig] = useState<RouletteConfig | null>(null);
  const [participantName, setParticipantName] = useState('');

  // Hook de ruleta usando la configuración actual
  const rouletteState = useRoulette(config?.sectors || []);

  // Extraer datos de la animación y resultado
  const isSpinning = rouletteState.animation.isSpinning;
  const currentAngle = rouletteState.animation.currentAngle;
  const lastWinner = rouletteState.lastResult?.winnerSector;

  // Animación para el componente de visualización
  const animation: RouletteAnimation = {
    isSpinning,
    currentAngle,
    finalAngle: rouletteState.animation.finalAngle,
    duration: rouletteState.animation.duration,
    startTime: rouletteState.animation.startTime,
    participantName: isSpinning ? participantName : undefined
  };

  // Calcular distribución de probabilidades
  const probabilityDistribution: ProbabilityDistribution | undefined = React.useMemo(() => {
    if (!config) return undefined;

    const prizes = config.sectors.filter(s => s.isPrize && s.isActive);
    const nonPrizes = config.sectors.filter(s => !s.isPrize && s.isActive);
    
    const prizesProbabilitySum = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    const totalPrizes = prizes.length;
    const totalNonPrizes = nonPrizes.length;
    
    const remainingProbability = Math.max(0, 100 - prizesProbabilitySum);
    const nonPrizesProbabilityEach = totalNonPrizes > 0 ? remainingProbability / totalNonPrizes : 0;
    
    const errors: string[] = [];
    
    if (prizesProbabilitySum > 100) {
      errors.push('La suma de probabilidades de premios excede el 100%');
    }
    
    if (totalPrizes === 0 && totalNonPrizes === 0) {
      errors.push('Debe haber al menos un sector activo');
    }
    
    if (prizesProbabilitySum === 100 && totalNonPrizes > 0) {
      errors.push('Con 100% de premios, no pueden existir sectores de "no premio"');
    }

    return {
      totalPrizes,
      totalNonPrizes,
      prizesProbabilitySum,
      nonPrizesProbabilityEach,
      isValid: errors.length === 0,
      errors
    };
  }, [config]);

  const handleSpin = () => {
    if (!config || !participantName.trim()) return;
    
    const activeSectors = config.sectors.filter(s => s.isActive);
    if (activeSectors.length === 0) return;

    rouletteState.spin();
  };

  const handleConfigChange = (newConfig: RouletteConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con navegación */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link 
              to="/demo"
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Volver al Demo</span>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            🎯 Configuración Avanzada con Vista Previa
          </h1>
          <p className="text-gray-300 text-lg">
            Sistema completo de personalización con vista previa en tiempo real
          </p>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Panel de Configuración - 3 columnas */}
          <div className="xl:col-span-3">
            <RouletteConfigPanel 
              onConfigChange={handleConfigChange}
            />
          </div>

          {/* Vista Previa en Tiempo Real - 1 columna */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Información del Cliente */}
            {config && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">👤 Información del Cliente</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cliente:</span>
                    <span className="text-white font-medium">
                      {config.clientName || 'Sin definir'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white font-medium">
                      {config.clientEmail || 'Sin definir'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Instagram:</span>
                    <span className="text-white font-medium">
                      {config.clientInstagram || 'Sin definir'}
                    </span>
                  </div>
                  {config.verificationEmail && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Email VIP:</span>
                      <span className="text-yellow-300 font-medium">
                        {config.verificationEmail}
                      </span>
                    </div>
                  )}
                </div>

                {/* Estado del sistema */}
                <div className="mt-4 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Estado:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        config.isDemoMode ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        config.isDemoMode ? 'text-yellow-300' : 'text-green-300'
                      }`}>
                        {config.isDemoMode ? 'DEMO' : 'PRODUCCIÓN'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-300 text-sm">Sistema:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        config.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        config.isActive ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {config.isActive ? 'ACTIVO' : 'PAUSADO'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vista Previa de la Ruleta */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 text-center">
                🎯 Vista Previa en Tiempo Real
              </h3>
              
              {!config || config.sectors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <div className="text-white font-bold mb-2">
                    ¡Configura tu Ruleta!
                  </div>
                  <div className="text-gray-300 text-sm">
                    Agrega sectores para ver la vista previa
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Ruleta */}
                  <div className="flex justify-center">
                    <RouletteWheel
                      sectors={config.sectors}
                      animation={animation}
                      width={280}
                      height={280}
                      probabilityDistribution={probabilityDistribution}
                    />
                  </div>

                  {/* Estadísticas rápidas */}
                  {probabilityDistribution && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-green-500/20 rounded p-2 text-center">
                        <div className="text-green-300 font-bold">
                          {probabilityDistribution.totalPrizes}
                        </div>
                        <div className="text-green-200">Premios</div>
                      </div>
                      <div className="bg-gray-500/20 rounded p-2 text-center">
                        <div className="text-gray-300 font-bold">
                          {probabilityDistribution.totalNonPrizes}
                        </div>
                        <div className="text-gray-200">No Premios</div>
                      </div>
                    </div>
                  )}

                  {/* Resultado */}
                  {lastWinner && (
                    <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                      <div className="text-yellow-200 text-xs mb-1">🎉 ¡ÚLTIMO GANADOR!</div>
                      <div className="text-white font-bold text-sm">
                        {lastWinner.displayName}
                      </div>
                      <div className="text-yellow-300 text-xs mt-1">
                        {lastWinner.isPrize ? '🏆 PREMIO' : '❌ NO PREMIO'}
                      </div>
                    </div>
                  )}

                  {/* Control de prueba */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                      placeholder="Nombre para prueba..."
                      disabled={isSpinning}
                    />
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSpin}
                        disabled={isSpinning || !participantName.trim() || !probabilityDistribution?.isValid}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-3 rounded font-bold text-sm transition-colors"
                      >
                        {isSpinning ? '🎯 Girando...' : '🚀 Probar'}
                      </button>

                      <button
                        onClick={() => rouletteState.reset()}
                        disabled={isSpinning}
                        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white py-2 px-3 rounded text-sm"
                      >
                        🔄
                      </button>
                    </div>

                    {!probabilityDistribution?.isValid && (
                      <div className="text-red-300 text-xs text-center">
                        ⚠️ Corrige errores para probar
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navegación flotante */}
      <DemoNavigation />
    </div>
  );
};
