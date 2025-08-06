// 🏭 GAME STUDIO - DASHBOARD PRINCIPAL
// Centro de control para crear, probar y publicar juegos

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GameStudioProject, GameTemplate, GameType } from '../../types/gameStudio';

const GameStudioDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'templates' | 'instances' | 'analytics'>('projects');

  // Mock data para desarrollo
  const [projects] = useState<GameStudioProject[]>([
    {
      id: '1',
      name: 'Ruleta Promocional V2',
      type: 'roulette',
      status: 'editing',
      draftConfig: {},
      changes: [],
      testResults: [],
      collaborators: ['dev1'],
      comments: []
    }
  ]);

  const [templates] = useState<GameTemplate[]>([
    {
      id: 'template-1',
      name: 'Ruleta Clásica',
      description: 'Ruleta básica con sectores personalizables',
      type: 'roulette',
      version: '1.0.0',
      status: 'published',
      baseConfig: {},
      customizableFields: ['sectors', 'colors', 'texts'],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      changelog: [],
      previousVersions: [],
      configSchema: {}
    }
  ]);

  const createNewProject = (type: GameType) => {
    console.log(`Crear nuevo proyecto tipo: ${type}`);
    // Aquí iría la lógica para crear un nuevo proyecto
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🏭 Game Studio</h1>
              <p className="text-gray-600 mt-1">Centro de desarrollo y gestión de juegos</p>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                to="/studio/migration" 
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                📋 Info Migración
              </Link>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                📊 Analytics Global
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                🚀 Deploy Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'projects', label: '🛠️ Proyectos', description: 'Juegos en desarrollo' },
              { id: 'templates', label: '📦 Templates', description: 'Juegos publicados' },
              { id: 'instances', label: '🎮 Instancias', description: 'Juegos activos' },
              { id: 'analytics', label: '📊 Analytics', description: 'Métricas globales' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        
        {/* Tab: Proyectos (Taller) */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🛠️ Taller de Juegos</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => createNewProject('roulette')}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  🎯 Nueva Ruleta
                </button>
                <button
                  onClick={() => createNewProject('dice')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  🎲 Nuevos Dados
                </button>
                <button
                  onClick={() => createNewProject('scratch')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  🃏 Nuevo Scratch
                </button>
              </div>
            </div>

            {/* Lista de proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {project.type} • {project.status}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'editing' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'testing' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'review' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      ✏️ Editar
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                        👁️ Preview
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                        🧪 Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Card para crear nuevo proyecto */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 transition-colors cursor-pointer">
                <div className="text-4xl mb-3">➕</div>
                <h3 className="font-medium text-gray-700 mb-2">Crear Nuevo Juego</h3>
                <p className="text-sm text-gray-500">Selecciona un tipo de juego arriba</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Templates */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📦 Catálogo de Templates</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                🔄 Sync Templates
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <p className="text-xs text-gray-400 mt-1">v{template.version}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.status === 'published' ? 'bg-green-100 text-green-800' :
                      template.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {template.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                      🎮 Crear Instancia
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                        📄 Docs
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                        📊 Stats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Instancias */}
        {activeTab === 'instances' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🎮 Juegos en Producción</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin instancias activas</h3>
              <p className="text-gray-500 mb-6">Crea tu primera instancia desde un template</p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                📦 Ver Templates
              </button>
            </div>
          </div>
        )}

        {/* Tab: Analytics */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Analytics Global</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-500">Proyectos Activos</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-gray-500">Templates Publicados</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-500">Instancias Activas</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-500">Jugadas Totales</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStudioDashboard;
