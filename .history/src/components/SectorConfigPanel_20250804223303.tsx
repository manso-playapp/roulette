import React, { useState, useEffect } from 'react';
import { RouletteSector } from '../types/roulette';

interface SectorConfigPanelProps {
  sector: RouletteSector | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sector: RouletteSector) => void;
  allSectors: RouletteSector[];
}

export const SectorConfigPanel: React.FC<SectorConfigPanelProps> = ({
  sector,
  isOpen,
  onClose,
  onSave,
  allSectors
}) => {
  const [formData, setFormData] = useState<Partial<RouletteSector>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del sector cuando se abre el panel
  useEffect(() => {
    if (sector) {
      setFormData({
        ...sector,
        // Asegurar valores por defecto
        displayName: sector.displayName || sector.formalName || '',
        backgroundColor: sector.backgroundColor || sector.color || '#3b82f6',
        textColor: sector.textColor || '#ffffff',
        fontSize: sector.fontSize || 16,
        letterSpacing: sector.letterSpacing || 0,
        lineHeight: sector.lineHeight || 1.2,
        distanceFromCenter: sector.distanceFromCenter || 50,
        textLines: sector.textLines || [sector.displayName || sector.formalName || ''],
        fontFamily: sector.fontFamily || 'Bebas Neue',
        probability: sector.probability || 0.1,
        isActive: sector.isActive !== false
      });
      setErrors({});
    }
  }, [sector]);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.formalName?.trim()) {
      newErrors.formalName = 'El nombre formal es obligatorio';
    }

    if (!formData.displayName?.trim()) {
      newErrors.displayName = 'El nombre a mostrar es obligatorio';
    }

    if (!formData.backgroundColor) {
      newErrors.backgroundColor = 'El color de fondo es obligatorio';
    }

    if (!formData.textColor) {
      newErrors.textColor = 'El color del texto es obligatorio';
    }

    if (!formData.probability || formData.probability <= 0 || formData.probability > 1) {
      newErrors.probability = 'La probabilidad debe estar entre 0.01 y 1.00';
    }

    // Validar que no haya nombres duplicados
    const duplicateName = allSectors.find(s => 
      s.id !== sector?.id && 
      (s.formalName === formData.formalName || s.displayName === formData.displayName)
    );
    
    if (duplicateName) {
      newErrors.formalName = 'Ya existe un sector con este nombre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !sector) return;

    const updatedSector: RouletteSector = {
      ...sector,
      ...formData,
      // Asegurar que los campos obligatorios estén presentes
      formalName: formData.formalName!,
      displayName: formData.displayName!,
      backgroundColor: formData.backgroundColor!,
      textColor: formData.textColor!,
      probability: formData.probability!,
      // Mantener compatibilidad
      color: formData.backgroundColor,
      label: formData.displayName
    };

    onSave(updatedSector);
    onClose();
  };

  // Colores predefinidos
  const predefinedColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#64748b', '#374151', '#111827'
  ];

  if (!isOpen || !sector) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Configurar Sector
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Nombres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Formal (Sistema)
                  </label>
                  <input
                    type="text"
                    value={formData.formalName || ''}
                    onChange={(e) => setFormData({...formData, formalName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.formalName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Premio 1, Descuento 20%, etc."
                  />
                  {errors.formalName && (
                    <p className="mt-1 text-sm text-red-600">{errors.formalName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre a Mostrar
                  </label>
                  <input
                    type="text"
                    value={formData.displayName || ''}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.displayName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="¡Premio!"
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
                  )}
                </div>
              </div>

              {/* Colores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Fondo
                  </label>
                  <div className="space-y-3">
                    <input
                      type="color"
                      value={formData.backgroundColor || '#3b82f6'}
                      onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <div className="grid grid-cols-10 gap-1">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({...formData, backgroundColor: color})}
                          className={`w-6 h-6 rounded border-2 transition-all ${
                            formData.backgroundColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color del Texto
                  </label>
                  <div className="space-y-3">
                    <input
                      type="color"
                      value={formData.textColor || '#ffffff'}
                      onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, textColor: '#ffffff'})}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          formData.textColor === '#ffffff' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Blanco
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, textColor: '#000000'})}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          formData.textColor === '#000000' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Negro
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista previa */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista Previa
                </label>
                <div
                  className="w-full h-16 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: formData.backgroundColor || '#3b82f6',
                    color: formData.textColor || '#ffffff',
                    fontSize: `${formData.fontSize || 16}px`,
                    letterSpacing: `${formData.letterSpacing || 0}px`,
                    lineHeight: formData.lineHeight || 1.2,
                    fontFamily: formData.fontFamily || 'Bebas Neue'
                  }}
                >
                  {formData.displayName || 'Vista Previa'}
                </div>
              </div>

              {/* Configuración de premio */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPrize"
                    checked={formData.isPrize || false}
                    onChange={(e) => setFormData({...formData, isPrize: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPrize" className="text-sm font-medium text-gray-700">
                    ¿Es un premio?
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Probabilidad ({((formData.probability || 0) * 100).toFixed(1)}%)
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={formData.probability || 0.1}
                    onChange={(e) => setFormData({...formData, probability: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  {errors.probability && (
                    <p className="mt-1 text-sm text-red-600">{errors.probability}</p>
                  )}
                </div>
              </div>

              {/* Configuración de texto */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Configuración de Texto</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamaño de Fuente
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="32"
                      value={formData.fontSize || 16}
                      onChange={(e) => setFormData({...formData, fontSize: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Espaciado de Letras
                    </label>
                    <input
                      type="number"
                      min="-2"
                      max="5"
                      step="0.1"
                      value={formData.letterSpacing || 0}
                      onChange={(e) => setFormData({...formData, letterSpacing: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
