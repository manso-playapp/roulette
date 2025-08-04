import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';
import { storage, auth } from '../firebase/config';
import { testFirebaseStorage } from '../utils/testStorage';
import { simpleStorageTest } from '../utils/simpleTest';

// Hacer las funciones de test disponibles globalmente para debugging
if (typeof window !== 'undefined') {
  (window as any).testFirebaseStorage = testFirebaseStorage;
  (window as any).simpleStorageTest = simpleStorageTest;
}

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
  downloadURL: string | null;
}

export const useFirebaseStorage = () => {
  const [uploadStates, setUploadStates] = useState<Record<string, UploadProgress>>({});

  const uploadImage = async (
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void,
    acceptedTypes: string = 'image/*'
  ): Promise<string> => {
    const uploadId = `${path}_${Date.now()}`;
    
    console.log('🔄 Iniciando upload:', { file: file.name, size: file.size, type: file.type, path });
    console.log('👤 Usuario autenticado:', auth.currentUser ? 'Sí' : 'No');
    console.log('🔑 UID:', auth.currentUser?.uid || 'No disponible');
    
    // Validaciones dinámicas según el tipo de archivo aceptado
    const isVideo = acceptedTypes.includes('video/*');
    const isImage = acceptedTypes.includes('image/*');
    
    if (isVideo && !file.type.startsWith('video/')) {
      console.error('❌ Error: No es un video');
      throw new Error('El archivo debe ser un video');
    } else if (isImage && !isVideo && !file.type.startsWith('image/')) {
      console.error('❌ Error: No es una imagen');
      throw new Error('El archivo debe ser una imagen');
    }
    
    // Límites de tamaño diferentes para video vs imagen
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB para video, 5MB para imagen
    const fileTypeLabel = isVideo ? 'video' : 'imagen';
    const maxSizeLabel = isVideo ? '50MB' : '5MB';
    
    if (file.size > maxSize) {
      console.error(`❌ Error: Archivo muy grande (${file.size} bytes, máximo ${maxSize})`);
      throw new Error(`El ${fileTypeLabel} debe ser menor a ${maxSizeLabel}`);
    }

    // Estado inicial
    setUploadStates(prev => ({
      ...prev,
      [uploadId]: {
        progress: 0,
        isUploading: true,
        error: null,
        downloadURL: null
      }
    }));

    try {
      // Crear referencia con timestamp para evitar colisiones
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const fullPath = `${path}/${fileName}`;
      console.log('📁 Creando referencia:', fullPath);
      
      const storageRef = ref(storage, fullPath);

      // Metadata opcional
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedAt': new Date().toISOString(),
          'originalName': file.name
        }
      };

      console.log('⬆️ Iniciando upload - método directo...');
      
      // Intentar método más directo
      console.log('📤 Creando referencia de storage...');
      
      // Verificar que storage esté inicializado
      console.log('🔧 Storage instance:', storage);
      console.log('🔧 Storage app:', storage.app);
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log('✅ Upload completado exitosamente:', snapshot);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('🔗 URL de descarga obtenida:', downloadURL);

      // Actualizar estado de éxito
      setUploadStates(prev => ({
        ...prev,
        [uploadId]: {
          progress: 100,
          isUploading: false,
          error: null,
          downloadURL
        }
      }));

      if (onProgress) onProgress(100);
      
      return downloadURL;

    } catch (error: any) {
      console.error('❌ Error durante upload:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
      console.error('Full error:', error);
      
      // Detectar tipos específicos de error
      const fileTypeLabel = acceptedTypes.includes('video/*') ? 'video' : 'imagen';
      let userFriendlyMessage = `Error al subir el ${fileTypeLabel}`;
      
      if (error.code === 'storage/unauthorized') {
        userFriendlyMessage = 'No tienes permisos para subir archivos. Verifica que estés logueado.';
      } else if (error.code === 'storage/unknown') {
        userFriendlyMessage = 'Error de conexión con Firebase Storage. Posible problema de CORS.';
      } else if (error.code === 'storage/canceled') {
        userFriendlyMessage = 'Upload cancelado por el usuario.';
      } else if (error.code === 'storage/quota-exceeded') {
        userFriendlyMessage = 'Cuota de storage excedida.';
      } else if (error.message?.includes('CORS')) {
        userFriendlyMessage = 'Error de CORS. Configuración de seguridad pendiente.';
      } else if (error.message?.includes('404')) {
        userFriendlyMessage = 'Servicio no encontrado. Verifica la configuración de Firebase.';
      }
      
      // Actualizar estado de error
      setUploadStates(prev => ({
        ...prev,
        [uploadId]: {
          progress: 0,
          isUploading: false,
          error: userFriendlyMessage,
          downloadURL: null
        }
      }));
      
      throw new Error(userFriendlyMessage);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      // Extraer la ruta del storage desde la URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
      
      if (!pathMatch) {
        throw new Error('URL de imagen inválida');
      }
      
      const imagePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, imagePath);
      
      await deleteObject(imageRef);
    } catch (error: any) {
      console.error('Error eliminando imagen:', error);
      throw new Error('Error al eliminar la imagen: ' + error.message);
    }
  };

  const getUploadState = (uploadId: string): UploadProgress | null => {
    return uploadStates[uploadId] || null;
  };

  const clearUploadState = (uploadId: string) => {
    setUploadStates(prev => {
      const newState = { ...prev };
      delete newState[uploadId];
      return newState;
    });
  };

  return {
    uploadImage,
    deleteImage,
    getUploadState,
    clearUploadState,
    uploadStates
  };
};
