// Test para verificar Firestore
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const testFirestore = async () => {
  console.log('🧪 Test de Firestore');
  
  try {
    console.log('👤 Usuario:', auth.currentUser?.email || 'No autenticado');
    console.log('🔧 Firestore:', db);
    console.log('🔧 Firestore app:', db.app.name);
    
    // Intentar escribir un documento de prueba
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Test desde la aplicación'
    };
    
    console.log('📝 Intentando escribir en Firestore...');
    await setDoc(doc(db, 'test', 'connection'), testDoc);
    console.log('✅ Escritura exitosa');
    
    // Intentar leer el documento
    console.log('📖 Intentando leer desde Firestore...');
    const docSnap = await getDoc(doc(db, 'test', 'connection'));
    
    if (docSnap.exists()) {
      console.log('✅ Lectura exitosa:', docSnap.data());
      return true;
    } else {
      console.error('❌ No se pudo leer el documento');
      return false;
    }
    
  } catch (error: any) {
    console.error('❌ Error en Firestore:', error);
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    return false;
  }
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  (window as any).testFirestore = testFirestore;
}
