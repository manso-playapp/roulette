// Prueba simple de Firebase Storage
import { storage, auth } from '../firebase/config';

// Test básico
export const simpleStorageTest = () => {
  console.log('🧪 Test básico de Firebase Storage');
  console.log('📦 Storage:', storage);
  console.log('🔧 Storage bucket:', storage.app.options.storageBucket);
  console.log('👤 Auth user:', auth.currentUser?.email || 'No autenticado');
  
  // Verificar que todo esté inicializado
  if (storage && storage.app) {
    console.log('✅ Firebase Storage está inicializado correctamente');
    return true;
  } else {
    console.error('❌ Firebase Storage NO está inicializado');
    return false;
  }
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  (window as any).simpleStorageTest = simpleStorageTest;
}
