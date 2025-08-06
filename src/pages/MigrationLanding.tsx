// 🚀 LANDING DE MIGRACIÓN
// Página temporal para mostrar la nueva estructura

import React from 'react';
import { Link } from 'react-router-dom';

const MigrationLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🏗️ Nueva Arquitectura Implementada
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Base sólida para crecimiento escalable con separación clara entre Templates e Instancias
          </p>
        </div>

        {/* Estructura Nueva vs Anterior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Nueva Estructura */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-2xl font-bold text-green-600">Nueva Arquitectura</h2>
              <p className="text-gray-600">Escalable y organizada</p>
            </div>
            
            <div className="space-y-4">
              <Link 
                to="/studio" 
                className="block bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-600 transition-colors text-center font-medium"
              >
                🏭 Game Studio (Principal)
              </Link>
              
              <div className="text-sm text-gray-600 space-y-2">
                <div>• 🛠️ Taller de Juegos (desarrollo)</div>
                <div>• 📦 Templates (juegos madre)</div>
                <div>• 🎮 Instancias (juegos cliente)</div>
                <div>• 📊 Analytics centralizadas</div>
                <div>• 🔄 Control de versiones automático</div>
              </div>
            </div>
          </div>

          {/* Estructura Anterior */}
          <div className="bg-gray-100 rounded-xl shadow-lg p-8 opacity-75">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📁</div>
              <h2 className="text-2xl font-bold text-gray-600">Estructura Anterior</h2>
              <p className="text-gray-500">Para referencia temporal</p>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/demo/configurator" 
                className="block bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors text-center"
              >
                🎛️ Configurador (Legacy)
              </Link>
              <Link 
                to="/admin/games" 
                className="block bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors text-center"
              >
                📋 Admin Games (Legacy)
              </Link>
              <Link 
                to="/demo" 
                className="block bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors text-center"
              >
                🎯 Demo Ruletas (Legacy)
              </Link>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🛣️ Roadmap de Implementación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-bold text-green-600 mb-2">FASE 1</h3>
              <div className="text-sm text-gray-600">
                <div>✅ Arquitectura base</div>
                <div>✅ Tipos TypeScript</div>
                <div>✅ Dashboard Studio</div>
                <div>✅ Estructura de carpetas</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🔨</div>
              <h3 className="font-bold text-blue-600 mb-2">FASE 2</h3>
              <div className="text-sm text-gray-600">
                <div>🔨 Editor de Templates</div>
                <div>🔨 Sistema de testing</div>
                <div>🔨 Preview en tiempo real</div>
                <div>🔨 Validación automática</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">⏳</div>
              <h3 className="font-bold text-purple-600 mb-2">FASE 3</h3>
              <div className="text-sm text-gray-600">
                <div>⏳ Sistema de Instancias</div>
                <div>⏳ Deploy automático</div>
                <div>⏳ Updates sin romper</div>
                <div>⏳ Analytics por instancia</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-bold text-orange-600 mb-2">FASE 4</h3>
              <div className="text-sm text-gray-600">
                <div>🚀 Multi-tenant completo</div>
                <div>🚀 API pública</div>
                <div>🚀 Marketplace</div>
                <div>🚀 White-label</div>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Beneficios de la Nueva Arquitectura</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-bold text-blue-800 mb-2">Updates Seguros</h3>
              <p className="text-blue-600 text-sm">
                Actualiza el juego madre y todas las instancias se actualizan automáticamente sin romperse
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-bold text-green-800 mb-2">Escalabilidad</h3>
              <p className="text-green-600 text-sm">
                Crea un juego una vez, úsalo para miles de clientes con personalizaciones únicas
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-purple-800 mb-2">Mantenimiento</h3>
              <p className="text-purple-600 text-sm">
                Una base de código limpia, testing automático y deploy controlado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationLanding;
