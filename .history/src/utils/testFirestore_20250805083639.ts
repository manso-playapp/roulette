// Test para verificar Firestore
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const testFirestore = async () => {
  console.log('📘 Test de Firestore');

  try {
    console.log('👤 Usuario:', auth.currentUser?.email || 'No autenticado');

    // Probar escritura y lectura en colecciones críticas
    const collectionsToTest = ['games', 'participants'];
    for (const collectionName of collectionsToTest) {
      const testDoc = {
        test: true,
        timestamp: new Date(),
        message: `Test en colección ${collectionName}`,
      };

      console.log(`✍️ Intentando escribir en colección ${collectionName}...`);
      await setDoc(doc(db, collectionName, 'test-doc'), testDoc);
      console.log(`✅ Escritura exitosa en ${collectionName}`);

      console.log(`📖 Intentando leer desde colección ${collectionName}...`);
      const docSnap = await getDoc(doc(db, collectionName, 'test-doc'));

      if (docSnap.exists()) {
        console.log(`✅ Lectura exitosa en ${collectionName}:`, docSnap.data());
      } else {
        console.error(`❌ No se pudo leer el documento en ${collectionName}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error en Firestore:', error);
    return false;
  }
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  (window as any).testFirestore = testFirestore;
}
