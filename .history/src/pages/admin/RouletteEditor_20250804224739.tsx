import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRouletteManager } from '../../hooks/useFirestore';
import { useRouletteConfig } from '../../hooks/useRouletteConfig';
import { RouletteConfigPanel } from '../../components/RouletteConfigPanel';
import { RouletteWheel } from '../../components/RouletteWheel';
import { RouletteConfig } from '../../types/roulette';

const RouletteEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRoulette, createRoulette, updateRoulette } = useRouletteManager(user?.uid);
  
  const [loading, setLoading] = useState(!!id); // True si hay ID para editar
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewRoulette, setIsNewRoulette] = useState(!id);
  const [activeTab, setActiveTab] = useState<'config' | 'personalization'>('config');
  const [hasLoaded, setHasLoaded] = useState(false); // Para evitar cargas múltiples

  const {
    config,
    setConfig,
    selectedSectorId,
    setSelectedSectorId,
    selectedSector,
    addSector,
    updateSector,
    removeSector,
    duplicateSector,
    updateSectorText,
    probabilityDistribution,
    autoDistributeProbabilities,
    createExampleSectors
  } = useRouletteConfig();

  // Cargar ruleta existente si hay ID
  useEffect(() => {
    const loadRoulette = async () => {
      if (!id || !user?.uid || hasLoaded) {
        console.log('Omitiendo carga - ID:', id, 'User:', !!user?.uid, 'HasLoaded:', hasLoaded);
        if (!id) setLoading(false); // Si no hay ID, no estamos cargando
        return;
      }

      console.log('Cargando ruleta con ID:', id);
      
      try {
        setLoading(true);
        setError(null);
        
        const roulette = await getRoulette(id);
        if (roulette) {
          console.log('Ruleta cargada:', roulette);
          setConfig(roulette);
          setIsNewRoulette(false);
          setHasLoaded(true);
        } else {
          console.log('Ruleta no encontrada');
          setError('Ruleta no encontrada');
        }
      } catch (error) {
        console.error('Error cargando ruleta:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar ruleta');
      } finally {
        setLoading(false);
      }
    };

    loadRoulette();
  }, [id, user?.uid, hasLoaded]); // Removemos getRoulette y setConfig de las dependencias

  // Función para guardar
  const handleSave = async () => {
    if (!user?.uid) return;

    try {
      setSaving(true);
      setError(null);

      if (isNewRoulette) {
        // Crear nueva ruleta
        const rouletteData = {
          ...config,
          createdBy: user.uid
        };
        delete (rouletteData as any).id; // Remover ID para que Firebase genere uno nuevo
        
        const newId = await createRoulette(rouletteData);
        navigate(`/admin/games/roulette/${newId}`, { replace: true });
        setIsNewRoulette(false);
      } else {
        // Actualizar ruleta existente
        await updateRoulette(id!, config);
      }

      // Mostrar mensaje de éxito (puedes agregar un toast aquí)
      console.log('Ruleta guardada exitosamente');
    } catch (error) {
      console.error('Error guardando ruleta:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar ruleta');
    } finally {
      setSaving(false);
    }
  };

  // Función para crear sectores de ejemplo
  const handleCreateExample = useCallback(() => {
    createExampleSectors();
  }, [createExampleSectors]);  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ruleta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/admin/games')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver a Gestión de Juegos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            {isNewRoulette ? 'Nueva Ruleta' : 'Editar Ruleta'}
          </h1>
          <p className="text-gray-400 font-body">
            {isNewRoulette 
              ? 'Configura una nueva ruleta para tus campañas' 
              : `Editando: ${config.name}`
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/admin/games')}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center space-x-2"
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{saving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'config', label: 'Configuración', icon: '⚙️' },
          { id: 'personalization', label: 'Personalización', icon: '🎨' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido por tabs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        {activeTab === 'config' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4 font-display">Configuración General</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica de la ruleta */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-purple-300 mb-3">Información de la Ruleta</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de la Ruleta
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Mi Ruleta Increíble"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Describe tu ruleta..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje de Bienvenida
                  </label>
                  <input
                    type="text"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="¡Participa y gana increíbles premios!"
                  />
                </div>

                {/* Estados */}
                <div className="pt-4 border-t border-white/10">
                  <h5 className="text-sm font-medium text-gray-300 mb-3">Estado de la Ruleta</h5>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.isActive}
                        onChange={(e) => setConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded 
                                 focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-white">Ruleta Activa</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.isDemoMode}
                        onChange={(e) => setConfig(prev => ({ ...prev, isDemoMode: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded 
                                 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white">Modo Demo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Configuración del cliente */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-purple-300 mb-3">Datos del Cliente</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    value={config.clientName}
                    onChange={(e) => setConfig(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Empresa ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email del Cliente
                  </label>
                  <input
                    type="email"
                    value={config.clientEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="cliente@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram del Cliente
                  </label>
                  <input
                    type="text"
                    value={config.clientInstagram}
                    onChange={(e) => setConfig(prev => ({ ...prev, clientInstagram: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="@cliente_empresa"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personalization' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6 font-display">Personalización Visual</h3>
            
            {config.sectors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-white mb-2 font-display">
                  ¡Personaliza tu ruleta!
                </h3>
                <p className="text-gray-400 mb-6">
                  Agrega sectores con premios o crea un ejemplo rápido para empezar
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={addSector}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                             transition-colors flex items-center space-x-2"
                  >
                    <span>➕</span>
                    <span>Agregar Primer Sector</span>
                  </button>
                  <button
                    onClick={handleCreateExample}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                             transition-colors flex items-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Crear Ejemplo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda: Configuración y personalización */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6 font-display">Configuración</h3>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de Fondo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setConfig(prev => ({ ...prev, backgroundImage: URL.createObjectURL(file) }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />

                    <label className="block text-sm font-medium text-gray-300 mb-2">Borde de la Ruleta (PNG)</label>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setConfig(prev => ({ ...prev, borderImage: URL.createObjectURL(file) }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />

                    <label className="block text-sm font-medium text-gray-300 mb-2">Marcador Central (PNG)</label>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setConfig(prev => ({ ...prev, centerMarkerImage: URL.createObjectURL(file) }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />

                    <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño del Borde</label>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.1"
                      value={config.borderSize || 0}
                      onChange={(e) => setConfig(prev => ({ ...prev, borderSize: parseFloat(e.target.value) }))}
                      className="w-full"
                    />

                    <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño del Marcador Central</label>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="0.1"
                      value={config.centerMarkerSize || 0}
                      onChange={(e) => setConfig(prev => ({ ...prev, centerMarkerSize: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Columna derecha: Vista previa */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6 font-display">Vista Previa</h3>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="aspect-w-9 aspect-h-16 bg-black relative">
                      {config.backgroundImage && (
                        <img
                          src={config.backgroundImage}
                          alt="Fondo"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <RouletteWheel
                        sectors={config.sectors}
                        animation={{ isSpinning: false, currentAngle: 0, targetAngle: 0, duration: 0 }}
                        width={320}
                        height={320}
                        probabilityDistribution={probabilityDistribution}
                        borderImage={config.borderImage}
                        borderSize={config.borderSize || 0}
                        centerMarkerImage={config.centerMarkerImage}
                        centerMarkerSize={config.centerMarkerSize || 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Información de la ruleta */}
      {!isNewRoulette && (
        <div className="mt-6 text-sm text-gray-400 text-center">
          <p>
            Creada el {config.createdAt.toLocaleDateString()} • 
            Última actualización: {config.updatedAt.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default RouletteEditor;
