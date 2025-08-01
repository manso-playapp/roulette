import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Datos de premios para la ruleta
const prizes = [
  { name: "🎁 iPhone 15 Pro" },
  { name: "🏆 Laptop Gaming RTX 4070" },
  { name: "🎉 AirPods Pro" },
  { name: "💎 iPad Air" },
  { name: "🌟 Apple Watch Series 9" },
  { name: "🎮 PlayStation 5" },
  { name: "📱 Samsung Galaxy S24" },
  { name: "💻 MacBook Air M3" },
  { name: "🎧 Sony WH-1000XM5" },
  { name: "⌚ Garmin Fenix 7" },
  { name: "📷 Canon EOS R6" },
  { name: "🖥️ Monitor 4K 27 pulgadas" },
  { name: "🎯 Premio Sorpresa" },
  { name: "💰 $500 USD" },
  { name: "🚗 Vale de Gasolina $100" }
];

export async function setupFirestore() {
  console.log("🚀 Iniciando configuración de Firestore...");
  
  try {
    const prizesCollection = collection(db, "prizes");
    
    for (const prize of prizes) {
      const docRef = await addDoc(prizesCollection, prize);
      console.log("✅ Premio agregado:", prize.name, "ID:", docRef.id);
    }
    
    console.log("🎉 ¡Configuración completada! Se agregaron", prizes.length, "premios.");
    
  } catch (error: any) {
    console.error("❌ Error configurando Firestore:", error);
    console.error("Código:", error?.code);
    console.error("Mensaje:", error?.message);
    
    if (error?.code === 'permission-denied') {
      console.log("💡 Solución: Ve a Firebase Console > Firestore > Reglas y cambia las reglas a:");
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
    }
  }
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  (window as any).setupFirestore = setupFirestore;
  console.log("💡 Para configurar Firestore, abre la consola del navegador y ejecuta: setupFirestore()");
}
