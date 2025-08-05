// 🎛️ PÁGINA DE CONFIGURACIÓN COMPLETA - NUEVA RULETA
// Editor visual completo con vista previa en tiempo real

import React, { useState } from 'react';
import { RouletteNew } from '../../components/RouletteNew';
import { RouletteAdvanced } from '../../components/RouletteAdvanced';
import { RouletteConfigPanelNew } from '../../components/RouletteConfigPanelNew';
import { RouletteSectorNew } from '../../types/rouletteNew';
import { RouletteVisualConfig } from '../../types/rouletteVisual';

const RouletteConfigPage: React.FC = () => {
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [useAdvancedRoulette, setUseAdvancedRoulette] = useState(true);
  const [visualConfig, setVisualConfig] = useState<Partial<RouletteVisualConfig>>({});
  
  // Sectores iniciales de ejemplo
  const [sectors, setSectors] = useState<RouletteSectorNew[]>([
    {
      id: '1',
      displayName: 'PREMIO GRANDE',
      backgroundColor: '#FF6B6B',
      textColor: '#FFFFFF',
      isPrize: true,
      probability: 15,
      isActive: true,
      order: 0,
      fontSize: 18,
      fontFamily: 'Arial'
    },
    {
      id: '2',
      displayName: 'DESCUENTO 20%',
      backgroundColor: '#4ECDC4',
      textColor: '#FFFFFF',
      isPrize: true,
      probability: 25,
      isActive: true,
      order: 1,
      fontSize: 16,
      fontFamily: 'Arial'
    },
    {
      id: '3',
      displayName: 'PRODUCTO GRATIS',
      backgroundColor: '#45B7D1',
      textColor: '#FFFFFF',
      isPrize: true,
      probability: 20,
      isActive: true,
      order: 2,
      fontSize: 16,
      fontFamily: 'Arial'
    },
    {
      id: '4',
      displayName: 'SIGUE INTENTANDO',
      backgroundColor: '#95A5A6',
      textColor: '#FFFFFF',
      isPrize: false,
      probability: 0,
      isActive: true,
      order: 3,
      fontSize: 14,
      fontFamily: 'Arial'
    }
  ]);

  const handleSpinComplete = (result: any) => {
    console.log('🎯 Resultado del giro en configuración:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🎛️ Configurador de Ruleta</h1>
              <p className="text-gray-600 mt-1">Editor visual en tiempo real</p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setUseAdvancedRoulette(!useAdvancedRoulette)}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  useAdvancedRoulette 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {useAdvancedRoulette ? '✨ Avanzada' : '🎯 Simple'}
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                💾 Guardar
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                👁️ Vista Previa
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium">
                🚀 Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel izquierdo: Vista previa de la ruleta */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">🎯 Vista Previa</h2>
                <p className="text-sm text-gray-600">Los cambios se aplican en tiempo real</p>
              </div>
              
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {useAdvancedRoulette ? (
                    <RouletteWheelAdvanced
                      sectors={sectors}
                      currentAngle={currentAngle}
                      size={350}
                      visualConfig={visualConfig}
                    />
                  ) : (
                    <RouletteNew
                      sectors={sectors}
                      onSpinComplete={handleSpinComplete}
                    />
                  )}
                </div>
              </div>

              {/* Información rápida */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-lg text-blue-600">{sectors.length}</div>
                    <div className="text-gray-600">Sectores</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-600">
                      {sectors.filter(s => s.isPrize && s.isActive).length}
                    </div>
                    <div className="text-gray-600">Premios</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-purple-600">
                      {sectors.filter(s => s.isPrize && s.isActive).reduce((sum, s) => sum + s.probability, 0)}%
                    </div>
                    <div className="text-gray-600">Total Premios</div>
                  </div>
                </div>
              </div>

              {/* Estado de la configuración */}
              <div className="mt-4">
                {sectors.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <div className="text-yellow-800 text-sm">
                      ⚠️ Agrega al menos un sector para comenzar
                    </div>
                  </div>
                )}
                
                {sectors.length > 0 && sectors.filter(s => s.isPrize && s.isActive).reduce((sum, s) => sum + s.probability, 0) > 100 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-red-800 text-sm">
                      ❌ Las probabilidades exceden el 100%
                    </div>
                  </div>
                )}
                
                {sectors.length > 0 && sectors.filter(s => s.isPrize && s.isActive).reduce((sum, s) => sum + s.probability, 0) <= 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-green-800 text-sm">
                      ✅ Configuración válida
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel derecho: Configuración */}
          <div className="order-1 lg:order-2">
            <RouletteConfigPanelNew
              sectors={sectors}
              onSectorsChange={setSectors}
              selectedSectorId={selectedSectorId}
              onSelectedSectorChange={setSelectedSectorId}
              visualConfig={visualConfig}
              onVisualConfigChange={setVisualConfig}
            />
          </div>
        </div>
      </div>

      {/* Tips flotantes */}
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="font-medium mb-2">💡 Consejos:</div>
        <ul className="text-sm space-y-1">
          <li>• Haz clic en un sector para editarlo</li>
          <li>• Usa la distribución automática para balancear</li>
          <li>• Los cambios se ven en tiempo real</li>
          <li>• Mantén las probabilidades bajo 100%</li>
        </ul>
      </div>
    </div>
  );
};

export default RouletteConfigPage;
