import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase/config';

// Función de prueba para Firebase Storage
export const testFirebaseStorage = async () => {
  console.log('🧪 Iniciando test de Firebase Storage...');
  
  try {
    // Verificar autenticación
    if (!auth.currentUser) {
      console.error('❌ No hay usuario autenticado');
      return false;
    }
    
    console.log('👤 Usuario:', auth.currentUser.email);
    
    // Crear un archivo de prueba
    const testContent = 'Test file for Firebase Storage';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    // Crear referencia
    const testRef = ref(storage, `test/test-${Date.now()}.txt`);
    console.log('📁 Referencia creada:', testRef.fullPath);
    
    // Subir archivo
    console.log('⬆️ Subiendo archivo de prueba...');
    const snapshot = await uploadBytes(testRef, testFile);
    console.log('✅ Archivo subido exitosamente');
    
    // Obtener URL
    const url = await getDownloadURL(snapshot.ref);
    console.log('🔗 URL obtenida:', url);
    
    return true;
    
  } catch (error: any) {
    console.error('❌ Error en test:', error);
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    return false;
  }
};

// Ejecutar test desde consola del navegador
(window as any).testFirebaseStorage = testFirebaseStorage;
