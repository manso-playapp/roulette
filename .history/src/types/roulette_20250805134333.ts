// Tipos para el sistema de ruleta avanzado
export interface RouletteSector {
  id: string;
  // Nombres
  formalName: string; // Nombre para sistema/emails
  displayName: string; // Nombre mostrado en el gajo
  label?: string; // Etiqueta alternativa para compatibilidad
  
  // Configuración visual
  backgroundColor: string;
  textColor: string;
  color?: string; // Alias para backgroundColor para compatibilidad
  fontSize?: number; // px
  letterSpacing?: number; // px
  lineHeight?: number; // multiplicador
  distanceFromCenter?: number; // % del radio
  
  // Configuración de texto
  textLines?: string[]; // Separado por comas, máximo 2 líneas
  fontFamily?: string; // Por defecto "Bebas Neue"
  
  // Configuración visual avanzada
  borderImage?: string; // URL de imagen del borde del sector
  centerIcon?: string; // URL o nombre del icono central
  iconScale?: number; // Escala del icono (0.1 - 2.0)
  borderWidth?: number; // Grosor del borde (1-10px)
  borderColor?: string; // Color del borde
  
  // Líneas divisorias
  dividerEnabled?: boolean; // Si tiene líneas divisorias
  dividerWidth?: number; // Grosor de líneas divisorias
  dividerColor?: string; // Color de líneas divisorias
  
  // Texto curvo
  curvedText?: boolean; // Si el texto sigue la curvatura
  
  // Configuración de premio
  isPrize: boolean; // ¿Es premio o no premio?
  probability: number; // 1-100, solo activo si isPrize = true
  
  // Estado y orden
  isActive?: boolean;
  order: number; // posición en la ruleta (empezando desde el norte)
  
  // Ángulos para renderizado
  minAngle?: number;
  maxAngle?: number;

  // Nuevas propiedades
  interlineSpacing?: number; // Espaciado entre líneas
  interletterSpacingLine2?: number; // Espaciado entre letras en la segunda línea
  borderScale?: number; // Escala del borde
  centerScale?: number; // Escala del centro
  lineThickness?: number; // Grosor de las líneas divisorias
  lineColor?: string; // Color de las líneas divisorias
  customIconUrl?: string; // URL de icono personalizado
  centerImage?: string; // Imagen del centro
  iconName?: string; // Nombre del icono
}

export interface RouletteConfig {
  id: string;
  name: string;
  description?: string;
  
  // Información del cliente
  clientName: string; // Nombre del cliente/empresa
  clientEmail: string; // Email del cliente
  clientInstagram?: string; // Perfil de Instagram del cliente
  verificationEmail?: string; // Email exento de verificación de repetición
  
  // Configuración de gajos
  sectors: RouletteSector[];
  
  // Configuración visual general
  backgroundImage?: string; // URL de Firebase Storage
  centerImage?: string; // URL del centro personalizado
  borderImage?: string; // URL del borde personalizado
  
  // Configuración de experiencia
  instagramAccount?: string; // Para el checkbox de seguimiento
  qrCode?: string; // URL del QR generado
  welcomeMessage?: string; // Mensaje personalizado
  
  // Estado del sistema
  isActive: boolean; // true = envía notificaciones, false = modo demo
  isDemoMode: boolean; // Modo demo (sin envío de emails)
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // user ID
}

export interface RouletteSpinResult {
  winnerSectorId: string;
  winnerSector: RouletteSector;
  participantName?: string; // Nombre del participante para compatibilidad
  isWinner: boolean; // Para compatibilidad
  finalAngle: number;
  spinDuration: number;
  timestamp: Date;
  
  // Información del participante
  participantInfo: {
    name: string;
    email: string;
    phone: string;
    followsInstagram: boolean;
    ipAddress?: string;
  };
  
  // Resultado
  prizeAwarded?: string;
}

export interface RouletteAnimation {
  isSpinning: boolean;
  currentAngle: number;
  targetAngle?: number;
  finalAngle?: number;
  duration: number;
  startTime?: number;
  
  // Información de la animación
  participantName?: string; // Para mostrar durante el giro
}

// Configuración visual avanzada
export interface RouletteVisualConfig {
  width: number;
  height: number;
  centerRadius: number;
  borderWidth: number;
  
  // Configuración de fuentes
  defaultFontFamily: string;
  fontFamily?: string; // Alias para defaultFontFamily
  defaultFontSize: number;
  fontSize?: number; // Alias para defaultFontSize para compatibilidad
  defaultTextColor: string;
  
  // Configuración de renderizado
  showLabels: boolean;
  antiAliasing: boolean;
  quality: 'low' | 'medium' | 'high';
  
  // Assets personalizados
  centerImageUrl?: string;
  borderImageUrl?: string;
  backgroundImageUrl?: string;
}

// Estado del componente ruleta
export interface RouletteState {
  config: RouletteConfig;
  visualConfig: RouletteVisualConfig;
  animation: RouletteAnimation;
  lastResult?: RouletteSpinResult;
  
  // Estado de configuración
  isConfigMode: boolean;
  selectedSectorId?: string;
}

// Configuración de un sector individual (para el editor)
export interface SectorEditConfig {
  id: string;
  formalName: string;
  displayName: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  distanceFromCenter: number;
  textLines: string[];
  fontFamily: string;
  isPrize: boolean;
  probability: number;
  isActive: boolean;
  order: number;

  // Campos avanzados de estilo
  curvedText?: boolean;
  interlineSpacing?: number;
  interletterSpacingLine2?: number;
  borderImage?: string;
  centerImage?: string;
  borderScale?: number;
  centerScale?: number;
  lineThickness?: number;
  lineColor?: string;
  iconName?: string;
  iconScale?: number;
  customIconUrl?: string;
}

// Configuración automática de probabilidades
export interface ProbabilityDistribution {
  totalPrizes: number;
  totalNonPrizes: number;
  prizesProbabilitySum: number;
  nonPrizesProbabilityEach: number;
  isValid: boolean;
  errors: string[];
}
