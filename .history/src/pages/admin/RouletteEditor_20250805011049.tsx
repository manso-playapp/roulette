import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRouletteManager } from '../../hooks/useFirestore';
import { useRouletteConfig } from '../../hooks/useRouletteConfig';
import { useRoulette } from '../../hooks/useRoulette';
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

  // Estados para personalización visual
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [borderImage, setBorderImage] = useState<string | null>(null);
  const [centerMarkerImage, setCenterMarkerImage] = useState<string | null>(null);
  const [borderSize, setBorderSize] = useState<number>(1.0);
  const [centerMarkerSize, setCenterMarkerSize] = useState<number>(4.0);

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
    moveSector,
    probabilityDistribution,
    autoDistributeProbabilities,
    createExampleSectors,
    copyStyle,
    pasteStyle,
    copiedStyle
  } = useRouletteConfig();

  // Hook para la funcionalidad de giro de prueba
  const { animation, lastResult, spin, reset, calculateWinner } = useRoulette(config.sectors);
  const [showTestResult, setShowTestResult] = useState(false);
  const [sectorTabs, setSectorTabs] = useState<Record<string, 'texto' | 'diseño' | 'icono'>>({});

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
  }, [createExampleSectors]);

  // Manejar resultado del giro de prueba
  useEffect(() => {
    if (lastResult && !animation.isSpinning) {
      const winner = calculateWinner(lastResult.finalAngle);
      setShowTestResult(true);
      
      // Auto-ocultar resultado después de 5 segundos
      setTimeout(() => {
        setShowTestResult(false);
      }, 5000);
    }
  }, [lastResult, animation.isSpinning, calculateWinner]);

  // Función para probar giro
  const handleTestSpin = () => {
    if (config.sectors.filter(s => s.isActive !== false).length === 0) {
      alert('Agrega al menos un sector para probar el giro');
      return;
    }
    
    setShowTestResult(false);
    spin();
  };  if (loading) {
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Columna izquierda: Configuración sin scroll */}
                <div className="space-y-6">
                  {/* Sectores de la ruleta */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-white">Sectores de la Ruleta</h4>
                        {copiedStyle && (
                          <div className="flex items-center space-x-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                            <span>🎨</span>
                            <span>Estilo copiado</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={addSector}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                                 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <span>➕</span>
                        <span>Agregar</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {config.sectors.map((sector, index) => (
                        <div
                          key={sector.id}
                          className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                        >
                          {/* Header del sector - siempre visible */}
                          <div
                            className={`p-3 cursor-pointer transition-all hover:bg-white/10 ${
                              selectedSectorId === sector.id ? 'bg-purple-500/20 border-b border-white/10' : ''
                            }`}
                            onClick={() => setSelectedSectorId(selectedSectorId === sector.id ? null : sector.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-5 h-5 rounded-full border-2 border-white/30"
                                  style={{ backgroundColor: sector.backgroundColor }}
                                ></div>
                                <div>
                                  <div className="text-white font-medium text-sm">
                                    {sector.displayName || sector.formalName}
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {sector.isPrize ? 'Premio' : 'No premio'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {/* Controles de orden */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveSector(sector.id, 'up');
                                  }}
                                  disabled={index === 0}
                                  className={`p-1 transition-colors rounded text-xs ${
                                    index === 0 
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : 'text-gray-400 hover:text-white'
                                  }`}
                                  title="Mover arriba"
                                >
                                  ⬆️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveSector(sector.id, 'down');
                                  }}
                                  disabled={index === config.sectors.length - 1}
                                  className={`p-1 transition-colors rounded text-xs ${
                                    index === config.sectors.length - 1 
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : 'text-gray-400 hover:text-white'
                                  }`}
                                  title="Mover abajo"
                                >
                                  ⬇️
                                </button>
                                
                                {/* Separador */}
                                <div className="w-px h-4 bg-gray-600 mx-1"></div>
                                
                                {/* Controles de estilo */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyStyle(sector.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors rounded text-xs"
                                  title="Copiar estilo"
                                >
                                  🎨
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    pasteStyle(sector.id);
                                  }}
                                  disabled={!copiedStyle}
                                  className={`p-1 transition-colors rounded text-xs ${
                                    !copiedStyle 
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : 'text-gray-400 hover:text-green-400'
                                  }`}
                                  title="Pegar estilo"
                                >
                                  ✨
                                </button>
                                
                                {/* Separador */}
                                <div className="w-px h-4 bg-gray-600 mx-1"></div>
                                
                                {/* Controles básicos */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateSector(sector.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-white transition-colors rounded text-xs"
                                  title="Duplicar"
                                >
                                  📋
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSector(sector.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors rounded text-xs"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                                <div className={`transition-transform text-xs ${selectedSectorId === sector.id ? 'rotate-180' : ''}`}>
                                  ▼
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Configuración desplegable del sector */}
                          {selectedSectorId === sector.id && (
                            <div className="p-3 bg-white/5 border-t border-white/10">
                              {/* Tabs del sector */}
                              <div className="flex space-x-1 mb-3">
                                {[
                                  { id: 'texto', label: 'Texto', icon: '📝' },
                                  { id: 'diseño', label: 'Diseño', icon: '🎨' },
                                  { id: 'icono', label: 'Icono', icon: '⭐' }
                                ].map((tab) => (
                                  <button
                                    key={tab.id}
                                    onClick={() => setSectorTabs(prev => ({ ...prev, [sector.id]: tab.id as any }))}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                                      (sectorTabs[sector.id] || 'texto') === tab.id
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                  >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                  </button>
                                ))}
                              </div>

                              {/* Contenido del tab */}
                              <div className="space-y-3">
                                {(sectorTabs[sector.id] || 'texto') === 'texto' && (
                                  <>
                                    {/* Nombre para mostrar */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Texto en la Ruleta
                                      </label>
                                      <input
                                        type="text"
                                        value={sector.displayName}
                                        onChange={(e) => updateSector(sector.id, { displayName: e.target.value })}
                                        className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                        placeholder="PREMIO 1"
                                      />
                                    </div>

                                    {/* Nombre formal */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Nombre del Premio
                                      </label>
                                      <input
                                        type="text"
                                        value={sector.formalName}
                                        onChange={(e) => updateSector(sector.id, { formalName: e.target.value })}
                                        className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                        placeholder="Premio Especial"
                                      />
                                    </div>

                                    {/* Tipografía */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                          Fuente
                                        </label>
                                        <select
                                          value={sector.fontFamily || 'Roboto'}
                                          onChange={(e) => updateSector(sector.id, { fontFamily: e.target.value })}
                                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                        >
                                          <option value="Roboto">Roboto (Recomendada)</option>
                                          <option value="Inter">Inter</option>
                                          <option value="Open Sans">Open Sans</option>
                                          <option value="Arial">Arial</option>
                                          <option value="Helvetica">Helvetica</option>
                                          <option value="Bebas Neue">Bebas Neue</option>
                                          <option value="Impact">Impact</option>
                                          <option value="Oswald">Oswald</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                          Tamaño ({sector.fontSize || 16}px)
                                        </label>
                                        <input
                                          type="range"
                                          min="10"
                                          max="72"
                                          value={sector.fontSize || 16}
                                          onChange={(e) => updateSector(sector.id, { fontSize: parseInt(e.target.value) })}
                                          className="w-full slider-enhanced"
                                        />
                                      </div>
                                    </div>

                                    {/* Espaciado */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                          Interletrado ({(sector.letterSpacing || 0).toFixed(1)}px)
                                        </label>
                                        <input
                                          type="range"
                                          min="-2"
                                          max="10"
                                          step="0.1"
                                          value={sector.letterSpacing || 0}
                                          onChange={(e) => updateSector(sector.id, { letterSpacing: parseFloat(e.target.value) })}
                                          className="w-full slider-enhanced"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                          Interlineado ({(sector.lineHeight || 1.2).toFixed(1)})
                                        </label>
                                        <input
                                          type="range"
                                          min="0.5"
                                          max="3.0"
                                          step="0.05"
                                          value={sector.lineHeight || 1.2}
                                          onChange={(e) => updateSector(sector.id, { lineHeight: parseFloat(e.target.value) })}
                                          className="w-full slider-enhanced"
                                        />
                                      </div>
                                    </div>

                                    {/* Posición del texto */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Distancia del Centro ({sector.distanceFromCenter || 70}%)
                                      </label>
                                      <input
                                        type="range"
                                        min="40"
                                        max="90"
                                        value={sector.distanceFromCenter || 70}
                                        onChange={(e) => updateSector(sector.id, { distanceFromCenter: parseInt(e.target.value) })}
                                        className="w-full slider-enhanced"
                                      />
                                    </div>

                                    {/* Texto curvo */}
                                    <div className="bg-white/5 rounded p-2">
                                      <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={sector.curvedText || false}
                                          onChange={(e) => updateSector(sector.id, { curvedText: e.target.checked })}
                                          className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded"
                                        />
                                        <span className="text-white text-xs">Texto Curvo</span>
                                      </label>
                                      <p className="text-gray-400 text-xs mt-1">Activa para que el texto siga la curvatura de la ruleta.</p>
                                    </div>
                                  </>
                                )}

                                {(sectorTabs[sector.id] || 'texto') === 'diseño' && (
                                  <>
                                    {/* Colores */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                          Color de Fondo
                                        </label>
                                        <input
                                          type="color"
                                          value={sector.backgroundColor}
                                          onChange={(e) => updateSector(sector.id, { backgroundColor: e.target.value })}
                                          className="w-full h-8 rounded border border-white/20"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                          Color de Texto
                                        </label>
                                        <input
                                          type="color"
                                          value={sector.textColor}
                                          onChange={(e) => updateSector(sector.id, { textColor: e.target.value })}
                                          className="w-full h-8 rounded border border-white/20"
                                        />
                                      </div>
                                    </div>

                                    {/* Imagen del Borde */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Imagen del Borde
                                      </label>
                                      <div className="flex space-x-2">
                                        <input
                                          type="text"
                                          value={sector.borderImage || ''}
                                          onChange={(e) => updateSector(sector.id, { borderImage: e.target.value })}
                                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                          placeholder="https://ejemplo.com/borde.png"
                                        />
                                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">📁</button>
                                      </div>
                                      {sector.borderImage && (
                                        <div className="mt-2 flex items-center space-x-2">
                                          <img src={sector.borderImage} alt="Borde" className="w-12 h-12 object-cover rounded border border-white/20" />
                                          <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                              Escala ({(sector.iconScale || 1.0).toFixed(1)})
                                            </label>
                                            <input
                                              type="range"
                                              min="0.5"
                                              max="2"
                                              step="0.1"
                                              value={sector.iconScale || 1.0}
                                              onChange={(e) => updateSector(sector.id, { iconScale: parseFloat(e.target.value) })}
                                              className="w-20 slider-enhanced"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Líneas Divisorias */}
                                    <div className="bg-white/5 rounded p-2">
                                      <label className="flex items-center space-x-2 cursor-pointer mb-2">
                                        <input
                                          type="checkbox"
                                          checked={sector.dividerEnabled || false}
                                          onChange={(e) => updateSector(sector.id, { dividerEnabled: e.target.checked })}
                                          className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded"
                                        />
                                        <span className="text-white text-xs">Líneas Divisorias</span>
                                      </label>
                                      
                                      {sector.dividerEnabled && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                              Grosor ({sector.dividerWidth || 2}px)
                                            </label>
                                            <input
                                              type="range"
                                              min="1"
                                              max="10"
                                              value={sector.dividerWidth || 2}
                                              onChange={(e) => updateSector(sector.id, { dividerWidth: parseInt(e.target.value) })}
                                              className="w-full slider-enhanced"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">
                                              Color
                                            </label>
                                            <input
                                              type="color"
                                              value={sector.dividerColor || '#ffffff'}
                                              onChange={(e) => updateSector(sector.id, { dividerColor: e.target.value })}
                                              className="w-full h-6 rounded border border-white/20"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}

                                {(sectorTabs[sector.id] || 'texto') === 'icono' && (
                                  <>
                                    {/* Nombre del Icono */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Nombre del Icono (Lucide)
                                      </label>
                                      <input
                                        type="text"
                                        value={sector.centerIcon || ''}
                                        onChange={(e) => updateSector(sector.id, { centerIcon: e.target.value })}
                                        className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                        placeholder="Ej: Gift, Trophy, Star"
                                      />
                                      <p className="text-gray-400 text-xs mt-1">
                                        Busca un icono en la <a href="https://lucide.dev" target="_blank" className="text-blue-400 hover:underline">biblioteca de Lucide</a> y pega su nombre aquí.
                                      </p>
                                    </div>

                                    {/* Escala del Icono */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Escala del Icono ({(sector.iconScale || 1.0).toFixed(1)})
                                      </label>
                                      <input
                                        type="range"
                                        min="0.3"
                                        max="2"
                                        step="0.1"
                                        value={sector.iconScale || 1.0}
                                        onChange={(e) => updateSector(sector.id, { iconScale: parseFloat(e.target.value) })}
                                        className="w-full slider-enhanced"
                                      />
                                    </div>

                                    {/* O usar una URL de imagen personalizada */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-300 mb-1">
                                        O usa una URL de imagen personalizada
                                      </label>
                                      <div className="flex space-x-2">
                                        <input
                                          type="text"
                                          value={sector.centerIcon?.startsWith('http') ? sector.centerIcon : ''}
                                          onChange={(e) => updateSector(sector.id, { centerIcon: e.target.value })}
                                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                          placeholder="Pega una URL o sube una imagen"
                                        />
                                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">📁</button>
                                      </div>
                                      
                                      {/* Vista previa */}
                                      {sector.centerIcon && (
                                        <div className="mt-2 p-3 bg-white/5 rounded border border-white/10">
                                          <div className="flex items-center justify-center h-20 bg-gray-600 rounded">
                                            {sector.centerIcon.startsWith('http') ? (
                                              <img src={sector.centerIcon} alt="Icono" className="max-h-16 max-w-16 object-contain" />
                                            ) : (
                                              <div className="text-white text-2xl">📷</div>
                                            )}
                                          </div>
                                          <p className="text-center text-gray-400 text-xs mt-1">Sin imagen</p>
                                        </div>
                                      )}
                                      
                                      <p className="text-gray-400 text-xs mt-1">
                                        Si rellenas este campo, se usará esta imagen en lugar del icono de Lucide.
                                      </p>
                                    </div>
                                  </>
                                )}

                                {/* Configuración de premio - siempre visible */}
                                <div className="border-t border-white/10 pt-3 mt-3">
                                  <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={sector.isPrize}
                                        onChange={(e) => updateSector(sector.id, { isPrize: e.target.checked })}
                                        className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded"
                                      />
                                      <span className="text-white text-xs">Es premio</span>
                                    </label>
                                    
                                    {sector.isPrize && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-400 text-xs">Probabilidad:</span>
                                        <input
                                          type="number"
                                          min="1"
                                          max="100"
                                          value={sector.probability}
                                          onChange={(e) => updateSector(sector.id, { probability: parseInt(e.target.value) || 0 })}
                                          className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                                          placeholder="20"
                                        />
                                        <span className="text-gray-400 text-xs">%</span>
                                      </div>
                                    )}
                                  </div>
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
                        className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                 transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <span>⚖️</span>
                        <span>Auto-distribuir</span>
                      </button>
                    )}

                    {/* Ayuda para controles */}
                    {config.sectors.length > 0 && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <h5 className="text-xs font-medium text-gray-300 mb-2">💡 Controles Rápidos</h5>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div><strong>⬆️⬇️</strong> Reordenar sectores</div>
                          <div><strong>🎨</strong> Copiar estilo (colores, fuente, etc.)</div>
                          <div><strong>✨</strong> Pegar estilo copiado</div>
                          <div><strong>📋</strong> Duplicar sector completo</div>
                          <div><strong>🗑️</strong> Eliminar sector</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Configuración Global */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-4">Configuración Global</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Velocidad de Giro</label>
                        <select className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm">
                          <option value="slow">Lenta</option>
                          <option value="normal">Normal</option>
                          <option value="fast">Rápida</option>
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-3 h-3 text-purple-600 bg-white/10 border-white/20 rounded" />
                          <span className="text-white text-xs">Activar sonidos de giro</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna derecha: Vista previa sticky */}
                <div className="sticky top-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white font-display">Vista Previa</h3>
                  
                  {/* Vista previa con proporción 9:16 */}
                  <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Imagen de fondo */}
                      {backgroundImage && (
                        <img 
                          src={backgroundImage} 
                          alt="Fondo TV" 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Contenedor de la ruleta */}
                      <div className="relative z-10 flex items-center justify-center">
                        <RouletteWheel 
                          sectors={config.sectors}
                          animation={animation}
                          width={600}
                          height={600}
                          probabilityDistribution={probabilityDistribution}
                        />
                        
                        {/* Borde personalizado */}
                        {borderImage && (
                          <img 
                            src={borderImage} 
                            alt="Borde" 
                            className="absolute inset-0 pointer-events-none"
                            style={{ 
                              width: `${600 + (borderSize * 50)}px`, 
                              height: `${600 + (borderSize * 50)}px`,
                              left: `${-(borderSize * 25)}px`,
                              top: `${-(borderSize * 25)}px`
                            }}
                          />
                        )}
                        
                        {/* Marcador central personalizado */}
                        {centerMarkerImage && (
                          <img 
                            src={centerMarkerImage} 
                            alt="Marcador Central" 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                            style={{ 
                              width: `${centerMarkerSize * 15}px`, 
                              height: `${centerMarkerSize * 15}px`
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información debajo de la vista previa */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-2">Información de la Vista Previa</h4>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div>Sectores activos: {config.sectors.filter(s => s.isActive !== false).length}</div>
                      <div>Resolución: 9:16 (TV vertical)</div>
                      {backgroundImage && <div>✓ Imagen de fondo aplicada</div>}
                      {borderImage && <div>✓ Borde personalizado (tamaño: {borderSize.toFixed(1)})</div>}
                      {centerMarkerImage && <div>✓ Marcador central (tamaño: {centerMarkerSize.toFixed(1)})</div>}
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleTestSpin}
                        disabled={animation.isSpinning || config.sectors.filter(s => s.isActive !== false).length === 0}
                        className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium ${
                          animation.isSpinning || config.sectors.filter(s => s.isActive !== false).length === 0
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <span>🎰</span>
                        <span>{animation.isSpinning ? 'Girando...' : 'Probar Giro'}</span>
                      </button>

                      {lastResult && (
                        <button
                          onClick={reset}
                          disabled={animation.isSpinning}
                          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                                   transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <span>🔄</span>
                          <span>Resetear</span>
                        </button>
                      )}
                    </div>

                    {/* Resultado del giro de prueba */}
                    {showTestResult && lastResult && (
                      <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg mb-1">🎉</div>
                          <div className="text-green-400 font-medium text-sm">
                            ¡Resultado de Prueba!
                          </div>
                          <div className="text-white text-sm">
                            {(() => {
                              const winner = calculateWinner(lastResult.finalAngle);
                              return winner ? winner.displayName || winner.formalName : 'Sin ganador';
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
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
