// 🎛️ PANEL DE CONFIGURACIÓN NUEVA - RULETA DESDE CERO
// Editor visual para modificar sectores sin contaminación

import React, { useState } from 'react';
import { RouletteSectorNew } from '../types/rouletteNew';
import { RouletteVisualConfig, ROULETTE_PRESETS, RoulettePresetName } from '../types/rouletteVisual';

interface RouletteConfigPanelNewProps {
  sectors: RouletteSectorNew[];
  onSectorsChange: (sectors: RouletteSectorNew[]) => void;
  selectedSectorId?: string | null;
  onSelectedSectorChange: (sectorId: string | null) => void;
  visualConfig?: Partial<RouletteVisualConfig>;
  onVisualConfigChange?: (config: Partial<RouletteVisualConfig>) => void;
}

export const RouletteConfigPanelNew: React.FC<RouletteConfigPanelNewProps> = ({
  sectors,
  onSectorsChange,
  selectedSectorId,
  onSelectedSectorChange
}) => {
  const [activeTab, setActiveTab] = useState<'sectors' | 'style' | 'visual' | 'probabilities'>('sectors');

  // Agregar nuevo sector
  const addSector = () => {
    const newSector: RouletteSectorNew = {
      id: crypto.randomUUID(),
      displayName: `SECTOR ${sectors.length + 1}`,
      backgroundColor: `hsl(${(sectors.length * 45) % 360}, 70%, 60%)`,
      textColor: '#FFFFFF',
      isPrize: true,
      probability: 10,
      isActive: true,
      order: sectors.length,
      fontSize: 16,
      fontFamily: 'Arial'
    };
    
    onSectorsChange([...sectors, newSector]);
    onSelectedSectorChange(newSector.id);
  };

  // Eliminar sector
  const removeSector = (sectorId: string) => {
    const newSectors = sectors
      .filter(s => s.id !== sectorId)
      .map((s, index) => ({ ...s, order: index }));
    
    onSectorsChange(newSectors);
    if (selectedSectorId === sectorId) {
      onSelectedSectorChange(null);
    }
  };

  // Actualizar sector
  const updateSector = (sectorId: string, updates: Partial<RouletteSectorNew>) => {
    const newSectors = sectors.map(sector =>
      sector.id === sectorId ? { ...sector, ...updates } : sector
    );
    onSectorsChange(newSectors);
  };

  // Duplicar sector
  const duplicateSector = (sectorId: string) => {
    const sectorToDuplicate = sectors.find(s => s.id === sectorId);
    if (!sectorToDuplicate) return;

    const duplicated: RouletteSectorNew = {
      ...sectorToDuplicate,
      id: crypto.randomUUID(),
      displayName: `${sectorToDuplicate.displayName} COPIA`,
      order: sectors.length
    };

    onSectorsChange([...sectors, duplicated]);
  };

  // Calcular probabilidades restantes
  const remainingProbability = () => {
    const usedProbability = sectors
      .filter(s => s.isPrize && s.isActive)
      .reduce((sum, s) => sum + s.probability, 0);
    return Math.max(0, 100 - usedProbability);
  };

  const selectedSector = selectedSectorId ? sectors.find(s => s.id === selectedSectorId) : null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header con tabs */}
      <div className="border-b border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎛️ Configuración de Ruleta</h2>
          <div className="flex space-x-1">
            {[
              { id: 'sectors', label: '📝 Sectores', icon: '📝' },
              { id: 'style', label: '🎨 Estilo', icon: '🎨' },
              { id: 'visual', label: '✨ Visual', icon: '✨' },
              { id: 'probabilities', label: '🎯 Probabilidades', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Tab: Sectores */}
        {activeTab === 'sectors' && (
          <div className="space-y-4">
            {/* Botón agregar sector */}
            <button
              onClick={addSector}
              className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              ➕ Agregar Sector
            </button>

            {/* Lista de sectores */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sectors.map((sector, index) => (
                <div
                  key={sector.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedSectorId === sector.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSelectedSectorChange(sector.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: sector.backgroundColor }}
                      />
                      <div>
                        <div className="font-medium text-gray-800">{sector.displayName}</div>
                        <div className="text-sm text-gray-500">
                          {sector.isPrize ? `🏆 Premio (${sector.probability}%)` : '❌ No Premio'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSector(sector.id);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Duplicar"
                      >
                        📋
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSector(sector.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sectors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <div>No hay sectores configurados</div>
                <div className="text-sm">Agrega tu primer sector para comenzar</div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Estilo */}
        {activeTab === 'style' && selectedSector && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-800 mb-2">
                Editando: {selectedSector.displayName}
              </div>
              <div
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg mx-auto"
                style={{ backgroundColor: selectedSector.backgroundColor }}
              />
            </div>

            {/* Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Texto del Sector
              </label>
              <input
                type="text"
                value={selectedSector.displayName}
                onChange={(e) => updateSector(selectedSector.id, { displayName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Texto del sector"
              />
            </div>

            {/* Colores */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎨 Color de Fondo
                </label>
                <input
                  type="color"
                  value={selectedSector.backgroundColor}
                  onChange={(e) => updateSector(selectedSector.id, { backgroundColor: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Color de Texto
                </label>
                <input
                  type="color"
                  value={selectedSector.textColor}
                  onChange={(e) => updateSector(selectedSector.id, { textColor: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Fuente */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📖 Fuente
                </label>
                <select
                  value={selectedSector.fontFamily}
                  onChange={(e) => updateSector(selectedSector.id, { fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📏 Tamaño: {selectedSector.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="32"
                  value={selectedSector.fontSize}
                  onChange={(e) => updateSector(selectedSector.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Tipo de sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Tipo de Sector
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedSector.isPrize}
                    onChange={() => updateSector(selectedSector.id, { isPrize: true })}
                    className="mr-2"
                  />
                  🏆 Premio
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!selectedSector.isPrize}
                    onChange={() => updateSector(selectedSector.id, { isPrize: false })}
                    className="mr-2"
                  />
                  ❌ No Premio
                </label>
              </div>
            </div>

            {/* Probabilidad (solo si es premio) */}
            {selectedSector.isPrize && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Probabilidad: {selectedSector.probability}%
                </label>
                <input
                  type="range"
                  min="1"
                  max={Math.min(50, remainingProbability() + selectedSector.probability)}
                  value={selectedSector.probability}
                  onChange={(e) => updateSector(selectedSector.id, { probability: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Probabilidad restante: {remainingProbability()}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Visual */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">✨ Configuración Visual</h3>
              <p className="text-sm text-gray-600">Personaliza la apariencia de la ruleta</p>
            </div>

            {/* Presets rápidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎨 Estilos Predefinidos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'modern', name: 'Moderno', color: '#E5E7EB', desc: 'Limpio y actual' },
                  { id: 'classic', name: 'Clásico', color: '#8B5CF6', desc: 'Tradicional' },
                  { id: 'neon', name: 'Neón', color: '#06B6D4', desc: 'Brillante y llamativo' },
                  { id: 'minimal', name: 'Minimalista', color: '#D1D5DB', desc: 'Simple y elegante' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 text-left transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="font-medium text-sm">{preset.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración de sombra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌟 Efectos de Sombra
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Habilitar sombra
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Difuminado</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      defaultValue="20"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Distancia</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      defaultValue="10"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración del centro */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⭕ Círculo Central
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Mostrar círculo central
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Color</label>
                    <input
                      type="color"
                      defaultValue="#FFFFFF"
                      className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tamaño</label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      defaultValue="30"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de la flecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ➤ Flecha Indicadora
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Mostrar flecha
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Posición</label>
                    <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                      <option value="top">Arriba</option>
                      <option value="right">Derecha</option>
                      <option value="bottom">Abajo</option>
                      <option value="left">Izquierda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Estilo</label>
                    <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                      <option value="triangle">Triángulo</option>
                      <option value="line">Línea</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de animación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Animación
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Duración: 3000ms
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="5000"
                    defaultValue="3000"
                    step="100"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tipo de easing</label>
                  <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option value="easeOut">Desaceleración suave</option>
                    <option value="easeInOut">Suave entrada y salida</option>
                    <option value="linear">Lineal</option>
                    <option value="bounce">Rebote</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Vueltas mín.</label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      defaultValue="3"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Vueltas máx.</label>
                    <input
                      type="number"
                      min="3"
                      max="15"
                      defaultValue="6"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Probabilidades */}
        {activeTab === 'probabilities' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">📊 Resumen de Probabilidades</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-600">🏆 Premios:</div>
                  <div className="font-mono">
                    {sectors.filter(s => s.isPrize && s.isActive).reduce((sum, s) => sum + s.probability, 0)}%
                  </div>
                </div>
                <div>
                  <div className="text-blue-600">❌ No Premios:</div>
                  <div className="font-mono">{remainingProbability()}%</div>
                </div>
              </div>
            </div>

            {/* Lista de probabilidades */}
            <div className="space-y-2">
              {sectors.filter(s => s.isActive).map((sector) => (
                <div
                  key={sector.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: sector.backgroundColor }}
                    />
                    <span className="font-medium">{sector.displayName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg">
                      {sector.isPrize ? `${sector.probability}%` : `${(remainingProbability() / sectors.filter(s => !s.isPrize && s.isActive).length || 0).toFixed(1)}%`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sector.isPrize ? '🏆 Premio' : '❌ No Premio'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Distribución automática */}
            <button
              onClick={() => {
                const prizes = sectors.filter(s => s.isPrize && s.isActive);
                if (prizes.length === 0) return;
                
                const probabilityPerPrize = Math.floor(80 / prizes.length);
                const newSectors = sectors.map(sector => {
                  if (sector.isPrize && sector.isActive) {
                    return { ...sector, probability: probabilityPerPrize };
                  }
                  return sector;
                });
                onSectorsChange(newSectors);
              }}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              ⚡ Distribución Automática (80% premios)
            </button>
          </div>
        )}

        {/* Mensaje si no hay sector seleccionado en tab de estilo */}
        {activeTab === 'style' && !selectedSector && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎨</div>
            <div>Selecciona un sector para editarlo</div>
            <div className="text-sm">Ve a la pestaña "Sectores" y haz clic en uno</div>
          </div>
        )}
      </div>
    </div>
  );
};
