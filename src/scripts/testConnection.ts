import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Script simple para probar conectividad a Firestore
const testFirestoreConnection = async () => {
  console.log("🔍 Probando conectividad a Firestore...");
  
  try {
    // Intentar escribir un documento de prueba
    const testDoc = doc(db, "test", "connection-test");
    const testData = {
      message: "Test de conectividad",
      timestamp: new Date(),
      status: "testing"
    };
    
    console.log("📝 Intentando escribir documento de prueba...");
    await setDoc(testDoc, testData);
    console.log("✅ Escritura exitosa");
    
    // Intentar leer el documento
    console.log("📖 Intentando leer documento de prueba...");
    const docSnap = await getDoc(testDoc);
    
    if (docSnap.exists()) {
      console.log("✅ Lectura exitosa:", docSnap.data());
      console.log("🎉 Firestore está funcionando perfectamente!");
      return true;
    } else {
      console.log("⚠️ El documento no existe después de crearlo");
      return false;
    }
    
  } catch (error: any) {
    console.error("❌ Error de conectividad:", error);
    console.error("Código:", error?.code);
    console.error("Mensaje:", error?.message);
    
    if (error?.code === 'permission-denied') {
      console.log("\n💡 SOLUCIÓN: Las reglas de Firestore están muy restrictivas");
      console.log("🔧 Ve a Firebase Console > Firestore Database > Reglas");
      console.log("🔧 Reemplaza las reglas con esto (SOLO PARA DESARROLLO):");
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
      `);
      console.log("⚠️ IMPORTANTE: Estas reglas son para desarrollo. En producción usar reglas más seguras.");
    }
    
    return false;
  }
};

// Ejecutar el test
testFirestoreConnection().then((success) => {
  if (success) {
    console.log("\n🚀 ¡Listo para ejecutar setup-firestore!");
  } else {
    console.log("\n⚠️ Configurar Firestore antes de continuar");
  }
}).catch(console.error);
