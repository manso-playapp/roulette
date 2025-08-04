import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { BaseGame, User, RouletteConfig, RouletteSegment, Prize } from "../types";

// ============================================
// DATOS DE EJEMPLO PARA LA PLATAFORMA
// ============================================

// Usuario de prueba
const demoUser: User = {
  id: 'demo-user-123',
  email: 'demo@playapp.com',
  name: 'Usuario Demo',
  plan: 'pro',
  subscription: {
    status: 'active',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Premios para la ruleta de pizzería
const pizzeriaPrizes: Prize[] = [
  {
    id: 'pizza-free',
    name: 'Pizza Gratis',
    type: 'free_service',
    description: 'Pizza mediana de tu elección',
    emailTemplate: {
      subject: '� ¡Ganaste una Pizza Gratis!',
      body: 'Felicidades, has ganado una pizza mediana de tu elección. Presenta este código en nuestro local.',
      formalName: '¡Ganaste una deliciosa pizza gratis!'
    },
    value: 1500,
    currency: 'ARS',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isReal: true,
    requiresApproval: false,
    securityCode: {
      enabled: true,
      format: 'alphanumeric',
      length: 6
    }
  },
  {
    id: 'discount-20',
    name: '20% OFF',
    type: 'discount_percentage',
    description: '20% de descuento en tu próxima compra',
    emailTemplate: {
      subject: '� ¡20% de Descuento para ti!',
      body: 'Tienes un 20% de descuento en tu próxima visita. ¡No lo dejes pasar!',
      formalName: '¡Ganaste 20% de descuento!'
    },
    value: 20,
    currency: 'ARS',
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isReal: true,
    requiresApproval: false
  },
  {
    id: 'bebida-gratis',
    name: 'Bebida Gratis',
    type: 'free_product',
    description: 'Bebida de tu elección',
    emailTemplate: {
      subject: '🥤 ¡Bebida Gratis!',
      body: 'Has ganado una bebida gratis. Válido en tu próxima visita.',
      formalName: '¡Ganaste una bebida gratis!'
    },
    value: 500,
    currency: 'ARS',
    isReal: true,
    requiresApproval: false
  },
  {
    id: 'try-again',
    name: 'Suerte la Próxima',
    type: 'try_again',
    description: 'No ganaste esta vez, pero ¡sigue intentando!',
    emailTemplate: {
      subject: '🍀 Suerte la Próxima',
      body: 'Esta vez no fue tu turno, pero no te desanimes. ¡Vuelve pronto!',
      formalName: 'Suerte la próxima vez'
    },
    isReal: false,
    requiresApproval: false
  }
];

// Segmentos para la ruleta
const rouletteSegments: RouletteSegment[] = [
  {
    id: 'seg-1',
    color: '#db0000',
    prize: pizzeriaPrizes[0], // Pizza Gratis
    text: {
      content: 'PIZZA GRATIS',
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'Bebas Neue',
      fontWeight: 700,
      letterSpacing: -0.5,
      lineHeight: 1.2,
      distanceFromCenter: 68,
      curved: true,
      angle: 0
    },
    icon: {
      type: 'lucide',
      name: 'Gift',
      scale: 0.95,
      color: '#ffffff'
    },
    probability: 15,
    weight: 15
  },
  {
    id: 'seg-2',
    color: '#4ade80',
    prize: pizzeriaPrizes[1], // 20% OFF
    text: {
      content: '20% OFF',
      color: '#ffffff',
      fontSize: 18,
      fontFamily: 'Bebas Neue',
      fontWeight: 700,
      letterSpacing: -0.5,
      lineHeight: 1.2,
      distanceFromCenter: 68,
      curved: true,
      angle: 45
    },
    icon: {
      type: 'lucide',
      name: 'Percent',
      scale: 0.95,
      color: '#ffffff'
    },
    probability: 25,
    weight: 25
  },
  {
    id: 'seg-3',
    color: '#3b82f6',
    prize: pizzeriaPrizes[2], // Bebida Gratis
    text: {
      content: 'BEBIDA GRATIS',
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Bebas Neue',
      fontWeight: 700,
      letterSpacing: -0.5,
      lineHeight: 1.2,
      distanceFromCenter: 68,
      curved: true,
      angle: 90
    },
    icon: {
      type: 'lucide',
      name: 'Coffee',
      scale: 0.95,
      color: '#ffffff'
    },
    probability: 20,
    weight: 20
  },
  {
    id: 'seg-4',
    color: '#c6af86',
    prize: pizzeriaPrizes[3], // Suerte la próxima
    text: {
      content: 'SUERTE LA PRÓXIMA',
      color: '#ffffff',
      fontSize: 12,
      fontFamily: 'Bebas Neue',
      fontWeight: 700,
      letterSpacing: -0.5,
      lineHeight: 1.2,
      distanceFromCenter: 68,
      curved: true,
      angle: 135
    },
    probability: 40,
    weight: 40
  }
];

// Configuración de la ruleta
const rouletteConfig: RouletteConfig = {
  design: {
    borderImage: 'https://mansoestudiocreativo.com/wheel-border.png',
    centerImage: 'https://mansoestudiocreativo.com/wheel-center.png',
    borderScale: 1.30,
    centerScale: 1.40,
    dividerLines: {
      thickness: 2.5,
      color: '#ffffff',
      enabled: true
    },
    spinDuration: 3000,
    spinEasing: 'ease-out'
  },
  segments: rouletteSegments,
  screens: {
    tvMode: true,
    mobileMode: true,
    displayImages: {
      waiting: 'https://mansoestudiocreativo.com/tv-waiting.png',
      spinning: 'https://mansoestudiocreativo.com/tv-spinning.png',
      winner: 'https://mansoestudiocreativo.com/tv-winner.png'
    }
  }
};

// Juego de ejemplo: Pizzería Mario
const demoGame: BaseGame = {
  id: 'pizzeria-mario-123',
  userId: demoUser.id,
  type: 'roulette',
  name: 'Ruleta Pizzería Mario',
  clientName: 'Pizzería Mario',
  clientEmail: 'mario@pizzeriamario.com',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  publicUrl: 'https://roulette-f9d63.web.app/game/pizzeria-mario-123',
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://roulette-f9d63.web.app/play/pizzeria-mario-123',
  
  general: {
    businessName: 'Pizzería Mario',
    businessEmail: 'mario@pizzeriamario.com',
    instagramUrl: 'https://instagram.com/pizzeriamario',
    accessType: 'platform',
    testEmails: ['test@pizzeriamario.com', 'demo@playapp.com'],
    emailNotifications: true,
    smsNotifications: false,
    colors: {
      primary: '#db0000',
      secondary: '#4ade80',
      accent: '#3b82f6',
      background: '#f8fafc'
    },
    logo: 'https://pizzeriamario.com/logo.png'
  },
  
  stats: {
    totalPlays: 144,
    totalPrizes: 62,
    totalParticipants: 89,
    lastPlayedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
    playsToday: 23,
    playsThisMonth: 144,
    playsThisYear: 144,
    prizesByType: {
      'Pizza Gratis': 18,
      '20% OFF': 31,
      'Bebida Gratis': 13,
      'Suerte la Próxima': 0
    },
    uniqueParticipants: 89,
    returningParticipants: 12
  },
  
  gameConfig: rouletteConfig
};

export async function setupFirestore() {
  console.log("🚀 Iniciando configuración completa de Firestore...");
  
  try {
    // 1. Crear usuario demo
    console.log("👤 Creando usuario demo...");
    await setDoc(doc(db, "users", demoUser.id), demoUser);
    console.log("✅ Usuario demo creado");

    // 2. Crear premios
    console.log("🏆 Creando premios...");
    for (const prize of pizzeriaPrizes) {
      await setDoc(doc(db, "prizes", prize.id), prize);
      console.log(`✅ Premio creado: ${prize.name}`);
    }

    // 3. Crear juego demo
    console.log("🎮 Creando juego demo...");
    await setDoc(doc(db, "games", demoGame.id), demoGame);
    console.log("✅ Juego demo creado: Pizzería Mario");

    // 4. Crear algunos participantes de ejemplo
    console.log("👥 Creando participantes de ejemplo...");
    const participants = [
      {
        id: 'participant-1',
        gameId: demoGame.id,
        name: 'Ana García',
        email: 'ana@email.com',
        phone: '+54911234567',
        verified: true,
        totalPlays: 3,
        totalWins: 1,
        firstPlayAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastPlayAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        plays: []
      },
      {
        id: 'participant-2',
        gameId: demoGame.id,
        name: 'Carlos Rodriguez',
        email: 'carlos@email.com',
        phone: '+54911234568',
        verified: true,
        totalPlays: 5,
        totalWins: 2,
        firstPlayAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        lastPlayAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        plays: []
      }
    ];

    for (const participant of participants) {
      await setDoc(doc(db, "participants", participant.id), participant);
      console.log(`✅ Participante creado: ${participant.name}`);
    }

    // 5. Crear algunas jugadas de ejemplo
    console.log("🎯 Creando jugadas de ejemplo...");
    const plays = [
      {
        id: 'play-1',
        participantId: 'participant-1',
        gameId: demoGame.id,
        segmentId: 'seg-2',
        prize: pizzeriaPrizes[1], // 20% OFF
        won: true,
        prizeCode: 'PIZZA20-ABC123',
        codeUsed: false,
        playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        emailSentAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'play-2',
        participantId: 'participant-2',
        gameId: demoGame.id,
        segmentId: 'seg-1',
        prize: pizzeriaPrizes[0], // Pizza Gratis
        won: true,
        prizeCode: 'PIZZA-FREE-XYZ789',
        codeUsed: true,
        codeUsedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        playedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        emailSentAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ];

    for (const play of plays) {
      await setDoc(doc(db, "plays", play.id), play);
      console.log(`✅ Jugada creada: ${play.won ? 'Ganó' : 'Perdió'} - ${play.prize?.name}`);
    }

    console.log("\n🎉 ¡Configuración completada exitosamente!");
    console.log("📊 Datos creados:");
    console.log(`   • 1 usuario demo`);
    console.log(`   • ${pizzeriaPrizes.length} premios`);
    console.log(`   • 1 juego (Pizzería Mario)`);
    console.log(`   • ${participants.length} participantes`);
    console.log(`   • ${plays.length} jugadas`);
    console.log("\n🔗 URLs del juego:");
    console.log(`   • Público: ${demoGame.publicUrl}`);
    console.log(`   • Participar: https://roulette-f9d63.web.app/play/pizzeria-mario-123`);
    
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
