import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Roulette } from '../../components/Roulette';
import { RouletteSector } from '../../types/roulette';
import { DemoNavigation } from '../../components/DemoNavigation';

// Datos de ejemplo para probar la ruleta
const sampleSectors: RouletteSector[] = [
  {
    id: '1',
    formalName: 'Premio 1',
    displayName: '🎁 Premio 1',
    label: '🎁 Premio 1',
    backgroundColor: '#ef4444',
    textColor: '#ffffff',
    color: '#ef4444',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['🎁', 'Premio 1'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 20,
    isActive: true,
    order: 0
  },
  {
    id: '2',
    formalName: 'Premio 2',
    displayName: '💰 Premio 2',
    label: '💰 Premio 2',
    backgroundColor: '#f97316',
    textColor: '#ffffff',
    color: '#f97316',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['💰', 'Premio 2'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 15,
    isActive: true,
    order: 1
  },
  {
    id: '3',
    formalName: 'Gran Premio',
    displayName: '🏆 Gran Premio',
    label: '🏆 Gran Premio',
    backgroundColor: '#eab308',
    textColor: '#ffffff',
    color: '#eab308',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['🏆', 'Gran Premio'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 5,
    isActive: true,
    order: 2
  },
  {
    id: '4',
    formalName: 'Prize 4',
    displayName: '🎊 Prize 4',
    label: '🎊 Prize 4',
    backgroundColor: '#22c55e',
    textColor: '#ffffff',
    color: '#22c55e',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['🎊', 'Prize 4'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 25,
    isActive: true,
    order: 3
  },
  {
    id: '5',
    formalName: 'Premio 5',
    displayName: '🎈 Premio 5',
    label: '🎈 Premio 5',
    backgroundColor: '#06b6d4',
    textColor: '#ffffff',
    color: '#06b6d4',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['🎈', 'Premio 5'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 15,
    isActive: true,
    order: 4
  },
  {
    id: '6',
    formalName: 'Especial',
    displayName: '🌟 Especial',
    label: '🌟 Especial',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    color: '#3b82f6',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['🌟', 'Especial'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 10,
    isActive: true,
    order: 5
  },
  {
    id: '7',
    formalName: 'Premio 7',
    displayName: '🎯 Premio 7',
    label: '🎯 Premio 7',
    backgroundColor: '#8b5cf6',
    textColor: '#ffffff',
    color: '#8b5cf6',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    distanceFromCenter: 70,
    textLines: ['🎯', 'Premio 7'],
    fontFamily: 'Bebas Neue',
    isPrize: true,
    probability: 10,
    isActive: true,
    order: 6
  }
];

export const RouletteDemoPage: React.FC = () => {
  const [sectors, setSectors] = useState<RouletteSector[]>(sampleSectors);
  const [spinHistory, setSpinHistory] = useState<Array<{ winner: string; timestamp: Date }>>([]);

  const handleSpinComplete = (result: { winner: RouletteSector | null; angle: number }) => {
    if (result.winner) {
      setSpinHistory(prev => [
        { winner: result.winner!.displayName || result.winner!.label || 'Desconocido', timestamp: new Date() },
        ...prev.slice(0, 9) // Mantener solo los últimos 10 resultados
      ]);
    }
  };

  const toggleSector = (sectorId: string) => {
    setSectors(prev => 
      prev.map(sector => 
        sector.id === sectorId 
          ? { ...sector, isActive: !sector.isActive }
          : sector
      )
    );
  };

  const activeSectors = sectors.filter(s => s.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎰 Demo Ruleta Interactiva
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Plataforma PlayApp Roulette v2.0.0 "Genesis" - Sistema completo de ruletas
          </p>
          
          {/* Botón de personalización prominente */}
          <div className="flex justify-center space-x-4 mb-6">
            <Link 
              to="/demo/config"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>Personalizar Ruleta</span>
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ruleta principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Ruleta de Premios
              </h2>
              
              <div className="flex justify-center">
                <Roulette
                  sectors={sectors}
                  onSpinComplete={handleSpinComplete}
                  visualConfig={{
                    width: 450,
                    height: 450,
                    centerRadius: 35,
                    fontSize: 12,
                    defaultFontFamily: 'Special Elite, monospace',
                    defaultFontSize: 12,
                    defaultTextColor: '#ffffff',
                    borderWidth: 3,
                    showLabels: true,
                    antiAliasing: true,
                    quality: 'high' as const
                  }}
                />
              </div>
            </div>
          </div>

          {/* Panel de control y estadísticas */}
          <div className="space-y-6">
            {/* Control de sectores */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📊 Control de Sectores
              </h3>
              
              <div className="space-y-3">
                {sectors.map(sector => (
                  <div key={sector.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: sector.color }}
                      ></div>
                      <span className="text-sm font-medium">{sector.label}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {sector.probability}%
                      </span>
                      <button
                        onClick={() => toggleSector(sector.id)}
                        className={`
                          w-12 h-6 rounded-full transition-all duration-200 relative
                          ${sector.isActive ? 'bg-green-500' : 'bg-gray-300'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200
                          ${sector.isActive ? 'translate-x-6' : 'translate-x-0.5'}
                        `}></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Sectores activos:</strong> {activeSectors.length} de {sectors.length}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Probabilidad total:</strong> {activeSectors.reduce((sum, s) => sum + s.probability, 0)}%
                </p>
              </div>
            </div>

            {/* Historial de resultados */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📈 Historial de Giros
              </h3>
              
              {spinHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay giros aún. ¡Prueba la ruleta!
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {spinHistory.map((result, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
                      <span className="text-sm font-medium">{result.winner}</span>
                      <span className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vista previa - aquí irá tu pestaña "aspecto" */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🎨 Vista Previa - Aspecto
              </h3>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎰</span>
                </div>
                <p className="text-sm text-gray-600">
                  Aquí aparecerá la vista previa con tus assets personalizados (borde y centro)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navegación flotante */}
      <DemoNavigation />
    </div>
  );
};
