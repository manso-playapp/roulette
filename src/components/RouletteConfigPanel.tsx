import React, { useState } from 'react';
import { useRouletteConfig } from '../hooks/useRouletteConfig';
import { RouletteSector } from '../types/roulette';
import { RouletteWheel } from './RouletteWheel';

interface RouletteConfigPanelProps {
  onConfigChange?: (config: any) => void;
  className?: string;
}

export const RouletteConfigPanel: React.FC<RouletteConfigPanelProps> = ({ 
  onConfigChange, 
  className = '' 
}) => {
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

  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');
  const [configSubTab, setConfigSubTab] = useState<'general' | 'personalization'>('general');
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [draggedSector, setDraggedSector] = useState<string | null>(null);

  // Notificar cambios al padre
  React.useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  // Funciones de drag & drop
  const handleDragStart = (e: React.DragEvent, sectorId: string) => {
    setDraggedSector(sectorId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectorId: string) => {
    e.preventDefault();
    if (!draggedSector || draggedSector === targetSectorId) return;

    const currentSectors = [...config.sectors];
    const draggedIndex = currentSectors.findIndex(s => s.id === draggedSector);
    const targetIndex = currentSectors.findIndex(s => s.id === targetSectorId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = currentSectors.splice(draggedIndex, 1);
      currentSectors.splice(targetIndex, 0, draggedItem);
      
      setConfig(prev => ({ ...prev, sectors: currentSectors }));
    }
    setDraggedSector(null);
  };

  const toggleSectorExpansion = (sectorId: string) => {
    setExpandedSector(expandedSector === sectorId ? null : sectorId);
  };

  const handleInlineEdit = (sectorId: string, field: string, value: any) => {
    updateSector(sectorId, { [field]: value });
  };

  // Componente de Configuración General
  const GeneralConfigTab = () => (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4 font-display">📋 Configuración General</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre del Cliente *
          </label>
          <input
            type="text"
            value={config.clientName}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, clientName: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            placeholder="Nombre de la empresa o cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email del Cliente *
          </label>
          <input
            type="email"
            value={config.clientEmail}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, clientEmail: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            placeholder="cliente@empresa.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre de la Ruleta *
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            placeholder="Mi Ruleta Personalizada"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Perfil de Instagram
          </label>
          <input
            type="text"
            value={config.clientInstagram || ''}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, clientInstagram: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            placeholder="@perfil_empresa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email de Verificación (exento de repetición)
          </label>
          <input
            type="email"
            value={config.verificationEmail || ''}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, verificationEmail: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            placeholder="admin@empresa.com"
          />
          <div className="text-xs text-gray-400 mt-1">
            Este email podrá participar múltiples veces sin restricciones
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mensaje de Bienvenida
          </label>
          <textarea
            value={config.welcomeMessage || ''}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, welcomeMessage: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            rows={2}
            placeholder="¡Participa y gana increíbles premios!"
          />
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="border-t border-white/20 pt-4">
        <h4 className="text-md font-semibold text-white mb-3">🔧 Estado del Sistema</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium text-white">Modo Demo</div>
              <div className="text-sm text-gray-400">
                {config.isDemoMode 
                  ? 'No se envían notificaciones por email' 
                  : 'Se envían notificaciones normalmente'
                }
              </div>
            </div>
            <button
              onClick={() => setConfig((prev: any) => ({ 
                ...prev, 
                isDemoMode: !prev.isDemoMode,
                updatedAt: new Date()
              }))}
              className={`
                w-12 h-6 rounded-full transition-colors relative
                ${config.isDemoMode ? 'bg-yellow-500' : 'bg-green-500'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5
                ${config.isDemoMode ? 'left-0.5' : 'left-6'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="font-medium text-white">Sistema Activo</div>
              <div className="text-sm text-gray-400">
                {config.isActive 
                  ? 'Ruleta disponible para participantes' 
                  : 'Ruleta pausada temporalmente'
                }
              </div>
            </div>
            <button
              onClick={() => setConfig((prev: any) => ({ 
                ...prev, 
                isActive: !prev.isActive,
                updatedAt: new Date()
              }))}
              className={`
                w-12 h-6 rounded-full transition-colors relative
                ${config.isActive ? 'bg-green-500' : 'bg-gray-500'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5
                ${config.isActive ? 'left-6' : 'left-0.5'}
              `} />
            </button>
          </div>
        </div>

        {/* Indicador visual del estado */}
        <div className="mt-4 p-3 rounded-lg border-2" style={{
          backgroundColor: config.isDemoMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(34, 197, 94, 0.1)',
          borderColor: config.isDemoMode ? '#FFC107' : '#22C55E'
        }}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${config.isDemoMode ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <div className={`font-medium ${config.isDemoMode ? 'text-yellow-300' : 'text-green-300'}`}>
              {config.isDemoMode ? '🧪 MODO DEMO ACTIVO' : '🚀 MODO PRODUCCIÓN'}
            </div>
          </div>
          <div className={`text-sm mt-1 ${config.isDemoMode ? 'text-yellow-200' : 'text-green-200'}`}>
            {config.isDemoMode 
              ? 'Perfecto para pruebas - no se enviarán emails reales'
              : 'Sistema en vivo - se enviarán notificaciones por email'
            }
          </div>
        </div>
      </div>
    </div>
  );

  // Pestaña de Personalización con sectores desplegables y drag & drop
  const PersonalizationTab = () => (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white font-display">🎯 Gajos de la Ruleta</h3>
          <div className="flex space-x-2">
            <button
              onClick={createExampleSectors}
              className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              Ejemplo
            </button>
            <button
              onClick={addSector}
              className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              + Agregar
            </button>
          </div>
        </div>
        
        {/* Estadísticas de probabilidad */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div className="bg-green-500/20 rounded p-2">
            <div className="text-green-300">Premios</div>
            <div className="text-white font-bold">
              {probabilityDistribution.totalPrizes} sectores
            </div>
            <div className="text-green-200 text-xs">
              {probabilityDistribution.prizesProbabilitySum}% total
            </div>
          </div>
          <div className="bg-gray-500/20 rounded p-2">
            <div className="text-gray-300">No Premios</div>
            <div className="text-white font-bold">
              {probabilityDistribution.totalNonPrizes} sectores
            </div>
            <div className="text-gray-200 text-xs">
              {probabilityDistribution.nonPrizesProbabilityEach.toFixed(1)}% c/u
            </div>
          </div>
        </div>

        {/* Errores de validación */}
        {!probabilityDistribution.isValid && (
          <div className="mb-3 p-2 bg-red-500/20 rounded border border-red-500/30">
            {probabilityDistribution.errors.map((error: string, index: number) => (
              <div key={index} className="text-red-200 text-xs">⚠️ {error}</div>
            ))}
          </div>
        )}

        {/* Botón de distribución automática */}
        <button
          onClick={autoDistributeProbabilities}
          className="w-full text-xs bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Distribuir Probabilidades Automáticamente
        </button>
      </div>

      {/* Lista de sectores con drag & drop */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm text-gray-300 mb-3">
          💡 Arrastra los sectores para reordenarlos en la ruleta
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {config.sectors.map((sector: RouletteSector, index: number) => (
            <div
              key={sector.id}
              draggable
              onDragStart={(e) => handleDragStart(e, sector.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, sector.id)}
              className={`
                border rounded-lg transition-all cursor-move sector-item
                ${draggedSector === sector.id ? 'drag-preview' : 'opacity-100'}
                ${expandedSector === sector.id 
                  ? 'border-purple-400 bg-purple-500/20' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                }
              `}
            >
              {/* Header del sector desplegable */}
              <div
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSectorExpansion(sector.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400">⋮⋮</div>
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: sector.backgroundColor }}
                  />
                  <div>
                    <div className="text-white font-medium text-sm">
                      {sector.displayName}
                    </div>
                    <div className="text-gray-300 text-xs">
                      {sector.isPrize ? `🏆 Premio ${sector.probability}%` : '❌ No Premio'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Toggle activo/inactivo */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInlineEdit(sector.id, 'isActive', !sector.isActive);
                    }}
                    className={`
                      w-8 h-4 rounded-full transition-all toggle-switch
                      ${sector.isActive ? 'bg-green-500' : 'bg-gray-400'}
                    `}
                  >
                    <div className={`
                      w-3 h-3 bg-white rounded-full transition-transform
                      ${sector.isActive ? 'translate-x-4' : 'translate-x-0.5'}
                    `} />
                  </button>

                  {/* Botones de acción */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSector(sector.id);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                    title="Duplicar"
                  >
                    📋
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSector(sector.id);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                  
                  {/* Indicador de expansión */}
                  <div className={`transform transition-transform ${
                    expandedSector === sector.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </div>
                </div>
              </div>

              {/* Panel expandible con configuraciones */}
              {expandedSector === sector.id && (
                <div className="border-t border-white/20 p-4 space-y-4">
                  
                  {/* Toggle Premio/No Premio */}
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Tipo de Sector</span>
                    <button
                      onClick={() => handleInlineEdit(sector.id, 'isPrize', !sector.isPrize)}
                      className={`
                        px-3 py-1 rounded text-xs font-medium transition-colors
                        ${sector.isPrize 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                        }
                      `}
                    >
                      {sector.isPrize ? '🏆 PREMIO' : '❌ NO PREMIO'}
                    </button>
                  </div>

                  {/* Configuración de texto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Texto del Gajo
                      </label>
                      <input
                        type="text"
                        value={(sector.textLines ?? [sector.displayName]).join(', ')}
                        onChange={(e) => {
                          const lines = e.target.value.split(',').map(line => line.trim()).slice(0, 2);
                          handleInlineEdit(sector.id, 'textLines', lines);
                        }}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                        placeholder="PREMIO, PRINCIPAL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre Interno
                      </label>
                      <input
                        type="text"
                        value={sector.formalName}
                        onChange={(e) => handleInlineEdit(sector.id, 'formalName', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                        placeholder="Premio Principal"
                      />
                    </div>
                  </div>

                  {/* Configuración visual */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color de Fondo
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={sector.backgroundColor}
                          onChange={(e) => handleInlineEdit(sector.id, 'backgroundColor', e.target.value)}
                          className="w-10 h-8 rounded border border-white/20"
                        />
                        <input
                          type="text"
                          value={sector.backgroundColor}
                          onChange={(e) => handleInlineEdit(sector.id, 'backgroundColor', e.target.value)}
                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color de Texto
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={sector.textColor}
                          onChange={(e) => handleInlineEdit(sector.id, 'textColor', e.target.value)}
                          className="w-10 h-8 rounded border border-white/20"
                        />
                        <input
                          type="text"
                          value={sector.textColor}
                          onChange={(e) => handleInlineEdit(sector.id, 'textColor', e.target.value)}
                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configuración de tipografía con sliders compactos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tamaño: {sector.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="32"
                        value={sector.fontSize}
                        onChange={(e) => handleInlineEdit(sector.id, 'fontSize', parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none slider-thumb"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Espaciado: {sector.letterSpacing}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={sector.letterSpacing}
                        onChange={(e) => handleInlineEdit(sector.id, 'letterSpacing', parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none slider-thumb"
                      />
                    </div>
                  </div>

                  {/* Configuración de posición */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Altura línea: {sector.lineHeight}
                      </label>
                      <input
                        type="range"
                        min="0.8"
                        max="2"
                        step="0.1"
                        value={sector.lineHeight}
                        onChange={(e) => handleInlineEdit(sector.id, 'lineHeight', parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none slider-thumb"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Distancia: {sector.distanceFromCenter}%
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="90"
                        value={sector.distanceFromCenter}
                        onChange={(e) => handleInlineEdit(sector.id, 'distanceFromCenter', parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none slider-thumb"
                      />
                    </div>
                  </div>

                  {/* Configuración de probabilidad (solo para premios) */}
                  {sector.isPrize && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Probabilidad de Premio: {sector.probability}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={sector.probability}
                        onChange={(e) => handleInlineEdit(sector.id, 'probability', parseInt(e.target.value))}
                        className="w-full h-2 bg-green-500/30 rounded-lg appearance-none slider-thumb"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 font-display">⚙️ Configuración de Ruleta</h2>
        <p className="text-gray-300">Personaliza todos los aspectos de tu ruleta interactiva</p>
      </div>

      {/* Pestañas principales */}
      <div className="flex space-x-1 mb-6 bg-white/10 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('config')}
          className={`
            flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all tab-transition
            ${activeTab === 'config' 
              ? 'bg-white text-purple-900 shadow-lg transform scale-105' 
              : 'text-white hover:bg-white/10'
            }
          `}
        >
          ⚙️ Configuración
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`
            flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all tab-transition
            ${activeTab === 'preview' 
              ? 'bg-white text-purple-900 shadow-lg transform scale-105' 
              : 'text-white hover:bg-white/10'
            }
          `}
        >
          👁️ Vista Previa
        </button>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'config' && (
        <div>
          {/* Sub-pestañas de configuración */}
          <div className="flex space-x-1 mb-4 bg-black/20 p-1 rounded-lg">
            <button
              onClick={() => setConfigSubTab('general')}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
                ${configSubTab === 'general' 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-white/10'
                }
              `}
            >
              📋 General
            </button>
            <button
              onClick={() => setConfigSubTab('personalization')}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
                ${configSubTab === 'personalization' 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-white/10'
                }
              `}
            >
              🎨 Personalización
            </button>
          </div>

          {/* Contenido de sub-pestañas */}
          {configSubTab === 'general' && <GeneralConfigTab />}
          {configSubTab === 'personalization' && <PersonalizationTab />}
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2 font-display">👁️ Vista Previa en Tiempo Real</h3>
            <p className="text-gray-300 text-sm">
              Los cambios se reflejan automáticamente en la ruleta
            </p>
          </div>
          
          {/* Información del cliente */}
          <div className="mb-6 p-4 bg-black/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Cliente</div>
                <div className="text-white font-medium">{config.clientName || 'Sin nombre'}</div>
              </div>
              <div>
                <div className="text-gray-400">Ruleta</div>
                <div className="text-white font-medium">{config.name || 'Sin título'}</div>
              </div>
              <div>
                <div className="text-gray-400">Estado</div>
                <div className={`font-medium ${config.isDemoMode ? 'text-yellow-300' : 'text-green-300'}`}>
                  {config.isDemoMode ? '🧪 Demo' : '🚀 Producción'}
                </div>
              </div>
            </div>
          </div>

          {/* Contenedor de la ruleta centrada */}
          <div className="flex justify-center items-center">
            <div className="relative">
              <RouletteWheel
                sectors={config.sectors}
                animation={{ 
                  isSpinning: false, 
                  currentAngle: 0, 
                  finalAngle: 0, 
                  duration: 0, 
                  startTime: 0 
                }}
                width={350}
                height={350}
                probabilityDistribution={probabilityDistribution}
                className="drop-shadow-2xl"
              />
              
              {/* Indicador de flecha */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Estadísticas de la ruleta */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white font-display">{config.sectors.length}</div>
              <div className="text-xs text-gray-400">Total Gajos</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-300 font-display">{probabilityDistribution.totalPrizes}</div>
              <div className="text-xs text-gray-400">Premios</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-300 font-display">{probabilityDistribution.prizesProbabilitySum}%</div>
              <div className="text-xs text-gray-400">Prob. Premios</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-300 font-display">
                {probabilityDistribution.isValid ? '✅' : '⚠️'}
              </div>
              <div className="text-xs text-gray-400">Validación</div>
            </div>
          </div>

          {/* Lista de premios activos */}
          {config.sectors.filter(s => s.isPrize && s.isActive).length > 0 && (
            <div className="mt-6 bg-black/20 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">🏆 Premios Disponibles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {config.sectors
                  .filter(s => s.isPrize && s.isActive)
                  .map(sector => (
                    <div key={sector.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: sector.backgroundColor }}
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{sector.displayName}</div>
                        <div className="text-gray-400 text-xs">{sector.probability}% probabilidad</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
