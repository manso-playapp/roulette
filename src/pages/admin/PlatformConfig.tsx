import React, { useState } from 'react';
import { usePlatformConfig } from '../../hooks/usePlatformConfig';
import { HeroCarouselImage } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';

export const PlatformConfigPage: React.FC = () => {
  const { config, loading, updateHeroImage, addHeroImage, removeHeroImage } = usePlatformConfig();
  const [editingImage, setEditingImage] = useState<HeroCarouselImage | null>(null);
  const [overlayColor, setOverlayColor] = useState('#000000'); // Color del overlay
  const [overlayOpacity, setOverlayOpacity] = useState(50); // Opacidad por defecto 50%
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImage, setNewImage] = useState<Partial<HeroCarouselImage>>({
    title: '',
    icon: '🎮',
    imageUrl: '',
    mediaType: 'image',
    overlay: 'overlay-custom-0-0-0-50', // Negro con 50% transparencia por defecto
    isActive: true,
    order: 1
  });

  // Función para convertir hex + opacidad a clase CSS de overlay
  const createOverlayClass = (hexColor: string, opacity: number): string => {
    // Convertir hex a rgb
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Crear clase CSS personalizada con rgba
    return `overlay-custom-${r}-${g}-${b}-${opacity}`;
  };

  // Función para obtener el estilo inline del overlay
  const getOverlayStyle = (hexColor: string, opacity: number) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    };
  };

  // Función para extraer color y opacidad del overlay existente
  const parseOverlay = (overlay: string): { color: string; opacity: number } => {
    // Si es un overlay personalizado, intentar extraer valores
    if (overlay.includes('overlay-custom-')) {
      const parts = overlay.split('-');
      if (parts.length >= 6) {
        const r = parseInt(parts[2]);
        const g = parseInt(parts[3]);
        const b = parseInt(parts[4]);
        const opacity = parseInt(parts[5]);
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        return { color: hex, opacity };
      }
    }
    
    // Valores por defecto
    return { color: '#000000', opacity: 50 };
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar la configuración</p>
      </div>
    );
  }

  const handleImageUpdate = async (imageId: string, updates: Partial<HeroCarouselImage>) => {
    await updateHeroImage(imageId, updates);
    setEditingImage(null);
  };

  const handleAddImage = async () => {
    if (!newImage.title || !newImage.imageUrl) {
      alert('Por favor completa el título y selecciona una imagen');
      return;
    }
    
    const maxOrder = Math.max(...config!.heroCarousel.images.map(img => img.order), 0);
    const imageToAdd = {
      ...newImage,
      order: maxOrder + 1
    } as Omit<HeroCarouselImage, 'id'>;
    
    await addHeroImage(imageToAdd);
    setShowAddModal(false);
    setNewImage({
      title: '',
      icon: '🎮',
      imageUrl: '',
      mediaType: 'image',
      overlay: 'overlay-custom-0-0-0-50', // Negro con 50% transparencia
      isActive: true,
      order: 1
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración de Plataforma</h1>
        <p className="text-gray-600">Administra las imágenes del carrusel del hero y otras configuraciones.</p>
      </div>

      {/* Hero Carousel Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Carrusel del Hero</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Agregar Imagen
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.heroCarousel.images.map((image) => (
            <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Preview de la imagen */}
              <div className="relative h-48 bg-gray-100">
                {image.mediaType === 'video' ? (
                  <video
                    src={image.imageUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img
                    src={image.imageUrl}
                    alt={`Media ${image.order}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Media+no+encontrado';
                    }}
                  />
                )}
                {/* Indicador sutil del tipo de media */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {image.mediaType === 'video' ? '🎥' : '📸'}
                </div>
              </div>

              {/* Controles */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Orden: {image.order}</span>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={image.isActive}
                        onChange={(e) => handleImageUpdate(image.id, { isActive: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Activa</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingImage(image);
                      const parsed = parseOverlay(image.overlay);
                      setOverlayColor(parsed.color);
                      setOverlayOpacity(parsed.opacity);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la imagen "${image.title}"?`)) {
                        removeHeroImage(image.id);
                      }
                    }}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Edición */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Editar Imagen</h3>
            
            <div className="space-y-4">
              {/* Selector de Tipo de Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Media</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={editingImage.mediaType === 'image'}
                      onChange={(e) => setEditingImage({...editingImage, mediaType: e.target.value as 'image' | 'video'})}
                      className="mr-2"
                    />
                    📸 Imagen
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={editingImage.mediaType === 'video'}
                      onChange={(e) => setEditingImage({...editingImage, mediaType: e.target.value as 'image' | 'video'})}
                      className="mr-2"
                    />
                    🎥 Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingImage.mediaType === 'video' ? 'Video' : 'Imagen'}
                </label>
                
                {/* Opción 1: Subir desde dispositivo */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    📁 Subir desde tu dispositivo {editingImage.mediaType === 'video' ? '(Video)' : '(Imagen)'}
                  </div>
                  <ImageUploader
                    currentImageUrl={editingImage.imageUrl}
                    onImageUploaded={(url: string) => setEditingImage({...editingImage, imageUrl: url})}
                    path="hero-carousel"
                    className="mb-4"
                    acceptedTypes={editingImage.mediaType === 'video' ? 'video/*' : 'image/*'}
                    maxSizeMB={editingImage.mediaType === 'video' ? 50 : 5}
                  />
                </div>

                {/* Opción 2: URL directa */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    🔗 O usar URL directa {editingImage.mediaType === 'video' ? '(Video)' : '(Imagen)'}
                  </div>
                  <input
                    type="url"
                    value={editingImage.imageUrl}
                    onChange={(e) => setEditingImage({...editingImage, imageUrl: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder={editingImage.mediaType === 'video' 
                      ? "https://ejemplo.com/video.mp4" 
                      : "https://images.unsplash.com/..."
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overlay de Color</label>
                
                {/* Preview en tiempo real */}
                {editingImage.imageUrl && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      ✨ Vista previa con overlay: {overlayOpacity}%
                    </div>
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      {editingImage.mediaType === 'video' ? (
                        <video
                          key={`video-${editingImage.imageUrl}-${overlayOpacity}`}
                          src={editingImage.imageUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          key={`image-${editingImage.imageUrl}-${overlayOpacity}`}
                          src={editingImage.imageUrl}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      {/* Overlay aplicado en tiempo real con estilo inline */}
                      <div 
                        key={`overlay-${overlayColor}-${overlayOpacity}`}
                        className="absolute inset-0"
                        style={getOverlayStyle(overlayColor, overlayOpacity)}
                      />
                      {/* Contenido de ejemplo para ver la legibilidad */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                          <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                            Título de ejemplo
                          </h3>
                          <p className="text-white/90 text-sm drop-shadow">
                            Texto de ejemplo para probar legibilidad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Color Picker para Overlay */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Color y Transparencia del Overlay
                  </label>
                  
                  {/* Selector de Color */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Color</label>
                      <input
                        type="color"
                        value={overlayColor}
                        onChange={(e) => {
                          setOverlayColor(e.target.value);
                          const newOverlay = createOverlayClass(e.target.value, overlayOpacity);
                          setEditingImage({...editingImage, overlay: newOverlay});
                        }}
                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex-2">
                      <label className="block text-xs text-gray-500 mb-1">
                        Transparencia: {overlayOpacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overlayOpacity}
                        onChange={(e) => {
                          const newOpacity = parseInt(e.target.value);
                          setOverlayOpacity(newOpacity);
                          const newOverlay = createOverlayClass(overlayColor, newOpacity);
                          setEditingImage({...editingImage, overlay: newOverlay});
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${overlayColor}00 0%, ${overlayColor}${Math.round(overlayOpacity * 2.55).toString(16).padStart(2, '0')} 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vista previa del color seleccionado */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-8 h-8 rounded border-2 border-white shadow-sm"
                      style={getOverlayStyle(overlayColor, overlayOpacity)}
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">Color seleccionado</div>
                      <div className="text-gray-500">
                        {overlayColor} • {overlayOpacity}% transparencia
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={editingImage.order}
                  onChange={(e) => setEditingImage({...editingImage, order: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleImageUpdate(editingImage.id, editingImage)}
                className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Nueva Imagen */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Agregar Nueva Imagen</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={newImage.title || ''}
                  onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ej: Mi Juego Personalizado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icono (emoji)</label>
                <input
                  type="text"
                  value={newImage.icon || ''}
                  onChange={(e) => setNewImage({...newImage, icon: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="🎮"
                />
              </div>

              {/* Selector de Tipo de Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Media</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="newMediaType"
                      value="image"
                      checked={newImage.mediaType === 'image'}
                      onChange={(e) => setNewImage({...newImage, mediaType: e.target.value as 'image' | 'video'})}
                      className="mr-2"
                    />
                    📸 Imagen
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="newMediaType"
                      value="video"
                      checked={newImage.mediaType === 'video'}
                      onChange={(e) => setNewImage({...newImage, mediaType: e.target.value as 'image' | 'video'})}
                      className="mr-2"
                    />
                    🎥 Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {newImage.mediaType === 'video' ? 'Video' : 'Imagen'}
                </label>
                
                {/* Opción 1: Subir desde dispositivo */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    📁 Subir desde tu dispositivo {newImage.mediaType === 'video' ? '(Video)' : '(Imagen)'}
                  </div>
                  <ImageUploader
                    currentImageUrl={newImage.imageUrl || ''}
                    onImageUploaded={(url: string) => setNewImage({...newImage, imageUrl: url})}
                    path="hero-carousel"
                    className="mb-4"
                    acceptedTypes={newImage.mediaType === 'video' ? 'video/*' : 'image/*'}
                    maxSizeMB={newImage.mediaType === 'video' ? 50 : 5}
                  />
                </div>

                {/* Opción 2: URL directa */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    🔗 O usar URL directa {newImage.mediaType === 'video' ? '(Video)' : '(Imagen)'}
                  </div>
                  <input
                    type="url"
                    value={newImage.imageUrl || ''}
                    onChange={(e) => setNewImage({...newImage, imageUrl: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder={newImage.mediaType === 'video' 
                      ? "https://ejemplo.com/video.mp4" 
                      : "https://images.unsplash.com/..."
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color y Transparencia del Overlay</label>
                
                {/* Color picker simple para el modal de agregar */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Color</label>
                    <input
                      type="color"
                      value="#000000"
                      onChange={(e) => {
                        const color = e.target.value;
                        const r = parseInt(color.slice(1, 3), 16);
                        const g = parseInt(color.slice(3, 5), 16);
                        const b = parseInt(color.slice(5, 7), 16);
                        const overlay = `overlay-custom-${r}-${g}-${b}-50`;
                        setNewImage({...newImage, overlay});
                      }}
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex-2">
                    <label className="block text-xs text-gray-500 mb-1">Transparencia: 50%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      onChange={(e) => {
                        const opacity = parseInt(e.target.value);
                        // Mantener el color actual y solo cambiar opacidad
                        const currentOverlay = newImage.overlay || 'overlay-custom-0-0-0-50';
                        const parts = currentOverlay.split('-');
                        if (parts.length >= 6) {
                          const r = parts[2];
                          const g = parts[3]; 
                          const b = parts[4];
                          const newOverlay = `overlay-custom-${r}-${g}-${b}-${opacity}`;
                          setNewImage({...newImage, overlay: newOverlay});
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddImage}
                className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Agregar Imagen
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewImage({
                    title: '',
                    icon: '🎮',
                    imageUrl: '',
                    overlay: 'bg-gradient-to-br from-purple-900/50 to-blue-900/50',
                    isActive: true,
                    order: 1
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de Guardar General */}
      <div className="flex justify-end mb-6">
        <button
          onClick={async () => {
            try {
              // La configuración ya se guarda automáticamente con cada cambio
              // Este botón es principalmente para feedback visual
              const saveBtn = document.querySelector('#saveBtn') as HTMLButtonElement;
              if (saveBtn) {
                saveBtn.innerHTML = '⏳ Guardando...';
                saveBtn.disabled = true;
              }
              
              await new Promise(resolve => setTimeout(resolve, 500)); // Simular guardado
              
              if (saveBtn) {
                saveBtn.innerHTML = '✅ ¡Guardado!';
                setTimeout(() => {
                  saveBtn.innerHTML = '💾 Guardar Configuración';
                  saveBtn.disabled = false;
                }, 2000);
              }
            } catch (error) {
              console.error('Error guardando:', error);
              alert('❌ Error al guardar la configuración');
            }
          }}
          id="saveBtn"
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
        >
          💾 Guardar Configuración
        </button>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Cómo usar imágenes personalizadas</h3>
        <div className="text-blue-800 space-y-2">
          <p><strong>📁 Subir archivos:</strong> Arrastra imágenes directamente desde tu dispositivo - se suben automáticamente a Firebase Storage</p>
          <p><strong>🔗 URLs externas:</strong> También puedes usar URLs de Unsplash, etc. con parámetros como: <code className="bg-blue-100 px-1 rounded">?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80</code></p>
          <p><strong>📏 Dimensiones recomendadas:</strong> 1920x1080 píxeles para mejor calidad (máximo 5MB)</p>
          <p><strong>🎨 Los overlays:</strong> Añaden una capa de color semi-transparente sobre la imagen para mejor legibilidad del texto</p>
          <p><strong>⚡ Optimización automática:</strong> Las imágenes se optimizan automáticamente para web</p>
        </div>
      </div>
    </div>
  );
};

// Estilos CSS para el slider personalizado
const sliderStyles = `
  /* Webkit browsers (Chrome, Safari) */
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  input[type="range"]::-webkit-slider-track {
    height: 8px;
    border-radius: 4px;
    outline: none;
    border: none;
  }

  /* Firefox */
  input[type="range"]::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  input[type="range"]::-moz-range-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  input[type="range"]::-moz-range-track {
    height: 8px;
    border-radius: 4px;
    outline: none;
    border: none;
  }
`;

// Inyectar estilos al DOM
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = sliderStyles;
  document.head.appendChild(styleSheet);
}
