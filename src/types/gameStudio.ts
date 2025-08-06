// 🏗️ GAME STUDIO - ARQUITECTURA BASE
// Separación clara entre Templates (juegos madre) e Instancias (juegos cliente)

export type GameType = 'roulette' | 'dice' | 'wheel' | 'scratch' | 'cards';
export type GameStatus = 'draft' | 'testing' | 'approved' | 'published' | 'deprecated';
export type InstanceStatus = 'active' | 'paused' | 'archived' | 'maintenance';

// 🎨 TEMPLATE (Juego Madre)
export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  type: GameType;
  version: string;
  status: GameStatus;
  
  // Configuración base del juego
  baseConfig: Record<string, any>;
  
  // Configuraciones que el cliente puede modificar
  customizableFields: string[];
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Control de versiones
  changelog: VersionChange[];
  previousVersions: string[];
  
  // Validación
  configSchema: any; // JSON Schema para validar configuraciones
}

// 🎮 INSTANCIA (Juego Cliente)
export interface GameInstance {
  id: string;
  templateId: string;
  templateVersion: string;
  
  // Información del cliente
  clientId: string;
  clientName: string;
  
  // Configuración personalizada (override del template)
  customConfig: Record<string, any>;
  
  // Estado y metadata
  status: InstanceStatus;
  deployedAt: Date;
  lastUpdate: Date;
  
  // URLs públicas
  publicUrl: string;
  embedUrl: string;
  
  // Analytics básicas
  totalPlays: number;
  lastPlayedAt?: Date;
  
  // Configuración de cliente
  clientSettings: {
    allowedCustomizations: string[];
    restrictions: Record<string, any>;
    branding: {
      logo?: string;
      colors?: Record<string, string>;
      customCSS?: string;
    };
  };
}

// 📊 CONTROL DE VERSIONES
export interface VersionChange {
  version: string;
  type: 'major' | 'minor' | 'patch';
  date: Date;
  description: string;
  breaking: boolean;
  affectedInstances?: string[];
}

// 🔧 CONFIGURACIÓN DE JUEGO GENÉRICA
export interface GameConfigBase {
  gameId: string;
  version: string;
  
  // Configuración visual básica
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  
  // Configuración de comportamiento
  behavior: {
    autoplay: boolean;
    soundEnabled: boolean;
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  
  // Configuración de reglas
  rules: Record<string, any>;
  
  // Textos personalizables
  texts: Record<string, string>;
}

// 🎯 CONFIGURACIÓN ESPECÍFICA DE RULETA
export interface RouletteTemplateConfig extends GameConfigBase {
  sectors: {
    id: string;
    label: string;
    probability: number;
    color: string;
    textColor: string;
    isPrize: boolean;
    value?: any;
  }[];
  
  visual: {
    diameter: number;
    borderWidth: number;
    shadowEnabled: boolean;
    centerCircle: {
      enabled: boolean;
      radius: number;
      color: string;
    };
    animation: {
      duration: number;
      easing: string;
      minSpins: number;
      maxSpins: number;
    };
  };
  
  rules: {
    maxPlaysPerUser: number;
    cooldownMinutes: number;
    requireRegistration: boolean;
  };
}

// 🏭 TALLER DE JUEGOS
export interface GameStudioProject {
  id: string;
  name: string;
  type: GameType;
  status: 'editing' | 'testing' | 'review' | 'ready';
  
  // Configuración en desarrollo
  draftConfig: Record<string, any>;
  
  // Historial de cambios
  changes: Array<{
    timestamp: Date;
    field: string;
    oldValue: any;
    newValue: any;
    userId: string;
  }>;
  
  // Testing
  testResults: Array<{
    timestamp: Date;
    testType: string;
    passed: boolean;
    details: any;
  }>;
  
  // Colaboración
  collaborators: string[];
  comments: Array<{
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

// 📈 ANALYTICS
export interface GameAnalytics {
  instanceId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  metrics: {
    totalPlays: number;
    uniqueUsers: number;
    averagePlayTime: number;
    completionRate: number;
    
    // Métricas específicas por tipo de juego
    gameSpecific: Record<string, number>;
  };
  
  trends: Array<{
    date: Date;
    plays: number;
    users: number;
  }>;
}
