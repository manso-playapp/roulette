// 🎯 PÁGINA DE PRUEBA - RULETA NUEVA DESDE CERO
// Para validar que todo funciona sin contaminación

import React from 'react';
import { RouletteNew } from '../../components/RouletteNew';
import { RouletteSectorNew } from '../../types/rouletteNew';

const TestRouletteNewPage: React.FC = () => {
  // Sectores de prueba simples
  const testSectors: RouletteSectorNew[] = [
    {
      id: '1',
      displayName: 'PREMIO GRANDE',
      backgroundColor: '#FF6B6B',
      textColor: '#FFFFFF',
      isPrize: true,
      probability: 10,
      isActive: true,
      order: 0,
      fontSize: 16,
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
      probability: 15,
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
      probability: 0, // Se calcula automáticamente
      isActive: true,
      order: 3,
      fontSize: 16,
      fontFamily: 'Arial'
    },
    {
      id: '5',
      displayName: 'DESCUENTO 10%',
      backgroundColor: '#F39C12',
      textColor: '#FFFFFF',
      isPrize: true,
      probability: 20,
      isActive: true,
      order: 4,
      fontSize: 16,
      fontFamily: 'Arial'
    },
    {
      id: '6',
      displayName: 'SIN PREMIO',
      backgroundColor: '#BDC3C7',
      textColor: '#2C3E50',
      isPrize: false,
      probability: 0, // Se calcula automáticamente
      isActive: true,
      order: 5,
      fontSize: 16,
      fontFamily: 'Arial'
    }
  ];

  const handleSpinComplete = (result: any) => {
    console.log('🎯 Resultado del giro:', result);
    
    if (result.winnerSector.isPrize) {
      console.log('🏆 ¡GANASTE!', result.winnerSector.displayName);
      // Aquí irían las notificaciones por email, etc.
    } else {
      console.log('😔 No ganaste esta vez, sigue intentando');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎰 Ruleta Nueva - Prueba Limpia
          </h1>
          <p className="text-lg text-gray-600">
            Versión completamente nueva, sin contaminación del código anterior
          </p>
          <div className="mt-4 p-4 bg-green-100 rounded-lg inline-block">
            <p className="text-sm text-green-800">
              ✅ Tipos nuevos | ✅ Lógica nueva | ✅ Renderizado nuevo
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <RouletteNew
            sectors={testSectors}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Información de sectores */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">📊 Configuración de Sectores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testSectors.map((sector) => (
              <div
                key={sector.id}
                className="p-4 rounded-lg shadow-lg border-2"
                style={{ 
                  backgroundColor: sector.backgroundColor + '20',
                  borderColor: sector.backgroundColor
                }}
              >
                <div className="font-bold text-lg">{sector.displayName}</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>Tipo: {sector.isPrize ? '🏆 Premio' : '❌ No Premio'}</div>
                  <div>Probabilidad: {sector.isPrize ? `${sector.probability}%` : 'Auto'}</div>
                  <div>Orden: {sector.order}</div>
                  <div>Estado: {sector.isActive ? '✅ Activo' : '❌ Inactivo'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
