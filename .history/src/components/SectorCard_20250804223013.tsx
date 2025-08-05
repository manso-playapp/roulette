import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RouletteSector } from '../types/roulette';

interface SectorCardProps {
  sector: RouletteSector;
  onEdit: (sector: RouletteSector) => void;
  onDelete: (sectorId: string) => void;
  onToggleActive: (sectorId: string) => void;
}

export const SectorCard: React.FC<SectorCardProps> = ({
  sector,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sector.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border-2 p-4 transition-all duration-200 ${
        isDragging ? 'shadow-2xl scale-105 z-50' : 'shadow-lg hover:shadow-xl'
      } ${
        sector.isActive ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      {/* Header con drag handle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors"
            title="Arrastrar para reordenar"
          >
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>

          {/* Indicator de orden */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {sector.order}
          </div>

          {/* Toggle activo/inactivo */}
          <button
            onClick={() => onToggleActive(sector.id)}
            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
              sector.isActive
                ? 'bg-green-500 border-green-500'
                : 'bg-gray-200 border-gray-300 hover:border-gray-400'
            }`}
            title={sector.isActive ? 'Desactivar sector' : 'Activar sector'}
          >
            {sector.isActive && (
              <svg className="w-4 h-4 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Acciones */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(sector)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar sector"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(sector.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar sector"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L7.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido del sector */}
      <div className="space-y-3">
        {/* Vista previa del color */}
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg border-2 border-gray-200"
            style={{ backgroundColor: sector.color }}
            title={`Color: ${sector.color}`}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{sector.label}</h3>
            <p className="text-sm text-gray-500">
              {sector.isPrize ? '🎁 Premio' : '📝 Información'}
            </p>
          </div>
        </div>

        {/* Probabilidad */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Probabilidad</span>
            <span className="text-sm font-semibold text-gray-900">
              {(sector.probability * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${sector.probability * 100}%` }}
            />
          </div>
        </div>

        {/* Descripción si existe */}
        {sector.description && (
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            {sector.description}
          </p>
        )}

        {/* Badge de premio */}
        {sector.isPrize && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ Premio Especial
          </div>
        )}
      </div>
    </div>
  );
};
