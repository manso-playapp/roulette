import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Script simple para crear datos paso a paso
const createBasicData = async () => {
  console.log("🚀 Creando datos básicos en Firestore...");
  
  try {
    // 1. Crear un juego simple
    console.log("🎮 Creando juego básico...");
    const gameData = {
      id: 'demo-game-001',
      name: 'Ruleta Demo',
      clientName: 'Pizzería Mario',
      status: 'active',
      type: 'roulette',
      createdAt: new Date(),
      totalPlays: 0,
      totalPrizes: 0
    };
    
    await setDoc(doc(db, "games", "demo-game-001"), gameData);
    console.log("✅ Juego creado exitosamente");

    // 2. Crear algunos premios
    console.log("🏆 Creando premios...");
    const prizes = [
      { name: "Pizza Gratis", type: "free_service", probability: 15 },
      { name: "20% OFF", type: "discount", probability: 25 },
      { name: "Bebida Gratis", type: "free_product", probability: 20 },
      { name: "Suerte la Próxima", type: "try_again", probability: 40 }
    ];

    for (let i = 0; i < prizes.length; i++) {
      const prize = prizes[i];
      await setDoc(doc(db, "prizes", `prize-${i + 1}`), {
        ...prize,
        gameId: 'demo-game-001',
        createdAt: new Date()
      });
      console.log(`✅ Premio creado: ${prize.name}`);
    }

    // 3. Crear un usuario demo
    console.log("👤 Creando usuario demo...");
    const userData = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Usuario Demo',
      plan: 'pro',
      createdAt: new Date()
    };
    
    await setDoc(doc(db, "users", "demo-user-123"), userData);
    console.log("✅ Usuario creado exitosamente");

    console.log("\n🎉 ¡Datos básicos creados exitosamente!");
    console.log("📊 Resumen:");
    console.log("   • 1 juego demo");
    console.log("   • 4 premios");
    console.log("   • 1 usuario");
    
    return true;

  } catch (error: any) {
    console.error("❌ Error creando datos:", error);
    console.error("Código:", error?.code);
    console.error("Mensaje:", error?.message);
    return false;
  }
};

// Ejecutar
createBasicData().then(success => {
  if (success) {
    console.log("\n✅ Setup completado. Ahora ejecuta: npm run health");
  }
}).catch(console.error);
