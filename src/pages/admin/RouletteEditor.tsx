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
                {/* Columna izquierda: Sectores desplegables */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-white">Sectores de la Ruleta</h4>
                    <button
                      onClick={addSector}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                               transition-colors flex items-center space-x-2"
                    >
                      <span>➕</span>
                      <span>Agregar Sector</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {config.sectors.map((sector, index) => (
                      <div
                        key={sector.id}
                        className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                      >
                        {/* Header del sector - siempre visible */}
                        <div
                          className={`p-4 cursor-pointer transition-all hover:bg-white/10 ${
                            selectedSectorId === sector.id ? 'bg-purple-500/20 border-b border-white/10' : ''
                          }`}
                          onClick={() => setSelectedSectorId(selectedSectorId === sector.id ? null : sector.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white/30"
                                style={{ backgroundColor: sector.backgroundColor }}
                              ></div>
                              <div>
                                <div className="text-white font-medium">
                                  {sector.displayName || sector.formalName}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {sector.isPrize ? 'Premio' : 'No premio'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateSector(sector.id);
                                }}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded"
                                title="Duplicar"
                              >
                                📋
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSector(sector.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                              <div className={`transition-transform ${selectedSectorId === sector.id ? 'rotate-180' : ''}`}>
                                ▼
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Configuración desplegable del sector */}
                        {selectedSectorId === sector.id && (
                          <div className="p-4 bg-white/5 border-t border-white/10">
                            <div className="space-y-4">
                              {/* Nombre para mostrar */}
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Texto en la Ruleta
                                </label>
                                <input
                                  type="text"
                                  value={sector.displayName}
                                  onChange={(e) => updateSector(sector.id, { displayName: e.target.value })}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                           text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                  placeholder="PREMIO 1"
                                />
                              </div>

                              {/* Nombre formal */}
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Nombre del Premio
                                </label>
                                <input
                                  type="text"
                                  value={sector.formalName}
                                  onChange={(e) => updateSector(sector.id, { formalName: e.target.value })}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                           text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                  placeholder="Premio Especial"
                                />
                              </div>

                              {/* Colores */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Color de Fondo
                                  </label>
                                  <div className="flex space-x-2">
                                    <input
                                      type="color"
                                      value={sector.backgroundColor}
                                      onChange={(e) => updateSector(sector.id, { backgroundColor: e.target.value })}
                                      className="w-10 h-10 rounded border border-white/20"
                                    />
                                    <input
                                      type="text"
                                      value={sector.backgroundColor}
                                      onChange={(e) => updateSector(sector.id, { backgroundColor: e.target.value })}
                                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                               text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm"
                                      placeholder="#FF6B6B"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Color de Texto
                                  </label>
                                  <div className="flex space-x-2">
                                    <input
                                      type="color"
                                      value={sector.textColor}
                                      onChange={(e) => updateSector(sector.id, { textColor: e.target.value })}
                                      className="w-10 h-10 rounded border border-white/20"
                                    />
                                    <input
                                      type="text"
                                      value={sector.textColor}
                                      onChange={(e) => updateSector(sector.id, { textColor: e.target.value })}
                                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                               text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm"
                                      placeholder="#FFFFFF"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Configuración de premio */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={sector.isPrize}
                                      onChange={(e) => updateSector(sector.id, { isPrize: e.target.checked })}
                                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded 
                                               focus:ring-purple-500 focus:ring-2"
                                    />
                                    <span className="text-white">Es un premio</span>
                                  </label>
                                </div>

                                {sector.isPrize && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                      Probabilidad (%)
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="100"
                                      value={sector.probability}
                                      onChange={(e) => updateSector(sector.id, { probability: parseInt(e.target.value) || 0 })}
                                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                               text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                      placeholder="20"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Botón de auto-distribución */}
                  {config.sectors.length > 1 && (
                    <button
                      onClick={autoDistributeProbabilities}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>⚖️</span>
                      <span>Auto-distribuir Probabilidades</span>
                    </button>
                  )}
                </div>

                {/* Columna derecha: Vista previa + configuración global */}
                <div className="space-y-6">
                  {/* Vista previa más grande */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-4 text-center">Vista Previa</h4>
                    <div className="flex justify-center mb-4">
                      <div className="w-80 h-80 flex items-center justify-center">
                        <RouletteWheel 
                          sectors={config.sectors}
                          animation={{ 
                            isSpinning: false, 
                            currentAngle: 0, 
                            targetAngle: 0, 
                            duration: 0 
                          }}
                          width={320}
                          height={320}
                          probabilityDistribution={probabilityDistribution}
                        />
                      </div>
                    </div>
                    
                    {/* Botón de giro de prueba */}
                    <div className="text-center">
                      <button
                        onClick={() => {
                          // Aquí implementaremos la lógica de giro de prueba
                          console.log('Giro de prueba - TODO: implementar');
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                                 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <span>🎰</span>
                        <span>Probar Giro</span>
                      </button>
                    </div>
                  </div>

                  {/* Configuraciones globales de la ruleta */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-4">Configuración Global</h4>
                    
                    <div className="space-y-4">
                      {/* Configuraciones futuras */}
                      <div className="text-center text-gray-400 py-4">
                        <div className="text-3xl mb-2">�</div>
                        <p className="text-sm">
                          Próximamente: Imagen de fondo TV, posición/escala de ruleta, código QR
                        </p>
                      </div>
                      
                      {/* Configuraciones básicas por ahora */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Velocidad de Giro
                        </label>
                        <select 
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                   text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="slow">Lenta</option>
                          <option value="normal" selected>Normal</option>
                          <option value="fast">Rápida</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sonidos
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded 
                                     focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-white">Activar sonidos de giro</span>
                        </label>
                      </div>
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
