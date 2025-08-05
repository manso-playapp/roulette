import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SectorCard } from './SectorCard';
import { RouletteSector } from '../types/roulette';

interface DraggableSectorsListProps {
  sectors: RouletteSector[];
  onSectorsChange: (sectors: RouletteSector[]) => void;
  onEditSector: (sector: RouletteSector) => void;
  onAddSector: () => void;
}

export const DraggableSectorsList: React.FC<DraggableSectorsListProps> = ({
  sectors,
  onSectorsChange,
  onEditSector,
  onAddSector
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [draggedSector, setDraggedSector] = useState<RouletteSector | null>(null);

  // Manejar el reordenamiento por drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedSector(null);

    if (over && active.id !== over.id) {
      const oldIndex = sectors.findIndex(sector => sector.id === active.id);
      const newIndex = sectors.findIndex(sector => sector.id === over.id);
      
      const reorderedSectors = arrayMove(sectors, oldIndex, newIndex);
      
      // Actualizar el orden de cada sector
      const updatedSectors = reorderedSectors.map((sector, index) => ({
        ...sector,
        order: index + 1
      }));

      onSectorsChange(updatedSectors);
    }
  };

  // Manejar eliminación de sector
  const handleDeleteSector = (sectorId: string) => {
    if (sectors.length <= 2) {
      alert('La ruleta debe tener al menos 2 sectores');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este sector?')) {
      const updatedSectors = sectors
        .filter(sector => sector.id !== sectorId)
        .map((sector, index) => ({
          ...sector,
          order: index + 1
        }));
      
      onSectorsChange(updatedSectors);
    }
  };

  // Manejar toggle de activo/inactivo
  const handleToggleActive = (sectorId: string) => {
    const activeSectors = sectors.filter(s => s.isActive);
    const targetSector = sectors.find(s => s.id === sectorId);
    
    // Si es el último sector activo, no permitir desactivarlo
    if (activeSectors.length <= 2 && targetSector?.isActive) {
      alert('La ruleta debe tener al menos 2 sectores activos');
      return;
    }

    const updatedSectors = sectors.map(sector =>
      sector.id === sectorId
        ? { ...sector, isActive: !sector.isActive }
        : sector
    );

    onSectorsChange(updatedSectors);
  };

  // Estadísticas de sectores
  const activeSectors = sectors.filter(s => s.isActive);
  const prizeSectors = activeSectors.filter(s => s.isPrize);
  const totalProbability = activeSectors.reduce((sum, s) => sum + s.probability, 0);

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Configuración de Sectores
          </h2>
          <button
            onClick={onAddSector}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Añadir Sector</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{sectors.length}</div>
            <div className="text-sm text-blue-600">Total Sectores</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activeSectors.length}</div>
            <div className="text-sm text-green-600">Sectores Activos</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{prizeSectors.length}</div>
            <div className="text-sm text-yellow-600">Sectores Premio</div>
          </div>
          <div className={`p-3 rounded-lg ${Math.abs(totalProbability - 1) < 0.01 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-2xl font-bold ${Math.abs(totalProbability - 1) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
              {(totalProbability * 100).toFixed(1)}%
            </div>
            <div className={`text-sm ${Math.abs(totalProbability - 1) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
              Probabilidad Total
            </div>
          </div>
        </div>

        {/* Alertas */}
        {Math.abs(totalProbability - 1) > 0.01 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium">
                La suma de probabilidades debe ser exactamente 100%. 
                Actual: {(totalProbability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de sectores arrastrables */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
          <span>Arrastra para reordenar sectores</span>
        </h3>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sectors.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <SectorCard
                  key={sector.id}
                  sector={sector}
                  onEdit={onEditSector}
                  onDelete={handleDeleteSector}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Arrastra los sectores por el ícono ☰ para reordenarlos</li>
          <li>• Usa el botón ⚪/✅ para activar/desactivar sectores</li>
          <li>• La suma de probabilidades debe ser exactamente 100%</li>
          <li>• Mínimo 2 sectores activos para que funcione la ruleta</li>
        </ul>
      </div>
    </div>
  );
};
