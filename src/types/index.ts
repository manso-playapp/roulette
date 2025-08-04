// 🎯 PLATAFORMA DE JUEGOS INTERACTIVOS - TIPOS BASE
// Arquitectura escalable para múltiples juegos

// ============================================
// USUARIO Y AUTENTICACIÓN
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'basic' | 'pro' | 'enterprise';
  subscription: {
    status: 'active' | 'inactive' | 'trial' | 'cancelled';
    expiresAt: Date;
    mercadoPagoId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SISTEMA DE JUEGOS (EXTENSIBLE)
// ============================================

export type GameType = 'roulette' | 'wheel-fortune' | 'scratch-cards' | 'trivia' | 'bingo' | 'memory';

export interface BaseGame {
  id: string;
  userId: string;
  type: GameType;
  name: string;
  clientName: string;
  clientEmail: string;
  status: 'demo' | 'active' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  version: number;
  publicUrl: string;
  qrCode?: string;
  
  // Configuración general
  general: GeneralConfig;
  
  // Estadísticas
  stats: GameStats;
  
  // Configuración específica del juego (polimórfica)
  gameConfig: RouletteConfig | WheelFortuneConfig | ScratchCardConfig | TriviaConfig;
}

// ============================================
// CONFIGURACIÓN DE PLATAFORMA
// ============================================

export interface PlatformConfig {
  id: string;
  
  // Branding general
  branding: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  
  // Hero Section - Carrusel de imágenes
  heroCarousel: {
    enabled: boolean;
    autoRotate: boolean;
    rotationInterval: number; // en segundos
    images: HeroCarouselImage[];
  };
  
  // SEO y metadatos
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
}

export interface HeroCarouselImage {
  id: string;
  title: string;
  icon: string; // emoji o URL de icono
  imageUrl: string; // URL de imagen o video
  mediaType: 'image' | 'video'; // Tipo de media
  overlay: string; // clase CSS para overlay de color
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
}

// Health Check Types
// ============================================

export interface GeneralConfig {
  // Información del cliente
  businessName: string;
  businessEmail: string;
  instagramUrl?: string;
  
  // Control de acceso
  accessType: 'client' | 'platform';
  testEmails: string[];
  
  // Notificaciones
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // Branding
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  logo?: string;
  customDomain?: string;
}

// ============================================
// ESTADÍSTICAS (COMPARTIDAS)
// ============================================

export interface GameStats {
  totalPlays: number;
  totalPrizes: number;
  totalParticipants: number;
  lastPlayedAt?: Date;
  
  // Por día/mes/año
  playsToday: number;
  playsThisMonth: number;
  playsThisYear: number;
  
  // Premios por tipo
  prizesByType: Record<string, number>;
  
  // Participantes únicos
  uniqueParticipants: number;
  returningParticipants: number;
}

// ============================================
// RULETA - CONFIGURACIÓN ESPECÍFICA
// ============================================

export interface RouletteConfig {
  // Diseño visual
  design: {
    // Imágenes
    borderImage?: string;
    centerImage?: string;
    backgroundImage?: string;
    
    // Escalas
    borderScale: number;
    centerScale: number;
    
    // Líneas divisorias
    dividerLines: {
      thickness: number;
      color: string;
      enabled: boolean;
    };
    
    // Animación
    spinDuration: number;
    spinEasing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
  
  // Segmentos/Premios
  segments: RouletteSegment[];
  
  // Configuración de pantallas
  screens: {
    tvMode: boolean;
    mobileMode: boolean;
    displayImages?: {
      waiting: string;
      spinning: string;
      winner: string;
    };
  };
}

export interface RouletteSegment {
  id: string;
  
  // Visual
  color: string;
  
  // Premio
  prize: Prize;
  
  // Texto
  text: {
    content: string;
    color: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
    letterSpacing: number;
    lineHeight: number;
    distanceFromCenter: number;
    curved: boolean;
    angle: number;
  };
  
  // Icono
  icon?: {
    type: 'lucide' | 'custom';
    name?: string; // Para Lucide
    url?: string;  // Para custom
    scale: number;
    color?: string;
  };
  
  // Probabilidad
  probability: number; // 0-100
  weight: number; // Calculado automáticamente
}

// ============================================
// SISTEMA DE PREMIOS (UNIVERSAL)
// ============================================

export interface Prize {
  id: string;
  name: string;
  type: PrizeType;
  description: string;
  
  // Email
  emailTemplate: {
    subject: string;
    body: string;
    formalName: string; // "¡Ganaste un corte gratis!"
  };
  
  // Valor y restricciones
  value?: number;
  currency?: 'ARS' | 'USD' | 'EUR';
  validUntil?: Date;
  usageLimit?: number;
  
  // Control
  isReal: boolean; // Para estadísticas
  requiresApproval: boolean;
  
  // Código de seguridad
  securityCode?: {
    enabled: boolean;
    format: 'alphanumeric' | 'numeric' | 'custom';
    length: number;
  };
}

export type PrizeType = 
  | 'discount_percentage'    // 10% OFF
  | 'discount_fixed'        // $500 OFF
  | 'free_service'          // CORTE GRATIS
  | 'free_product'          // PRODUCTO GRATIS
  | 'try_again'             // SUERTE LA PRÓXIMA
  | 'custom';               // Personalizado

// ============================================
// PARTICIPANTES Y JUGADAS
// ============================================

export interface Participant {
  id: string;
  gameId: string;
  
  // Datos personales
  name: string;
  email: string;
  phone?: string;
  
  // Verificación
  verified: boolean;
  verificationCode?: string;
  
  // Historial
  plays: Play[];
  totalPlays: number;
  totalWins: number;
  
  // Timestamps
  firstPlayAt: Date;
  lastPlayAt: Date;
  createdAt: Date;
}

export interface Play {
  id: string;
  participantId: string;
  gameId: string;
  
  // Resultado
  segmentId: string;
  prize?: Prize;
  won: boolean;
  
  // Código de premio
  prizeCode?: string;
  codeUsed: boolean;
  codeUsedAt?: Date;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  location?: {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
  };
  
  // Timestamps
  playedAt: Date;
  emailSentAt?: Date;
}

// ============================================
// SISTEMA DE VERSIONES
// ============================================

export interface GameVersion {
  id: string;
  gameId: string;
  version: number;
  
  // Snapshot completo del juego
  snapshot: BaseGame;
  
  // Metadata
  description?: string;
  author: string;
  tags: string[];
  
  // Control
  isActive: boolean;
  isProduction: boolean;
  
  // Timestamps
  createdAt: Date;
  deployedAt?: Date;
}

// ============================================
// CONFIGURACIONES FUTURAS (PLACEHOLDERS)
// ============================================

export interface WheelFortuneConfig {
  // TODO: Implementar cuando agreguemos Wheel of Fortune
  segments: any[];
}

export interface ScratchCardConfig {
  // TODO: Implementar cuando agreguemos Scratch Cards
  cards: any[];
}

export interface TriviaConfig {
  // TODO: Implementar cuando agreguemos Trivia
  questions: any[];
}

// ============================================
// CONFIGURACIÓN DE SERVICIOS
// ============================================

export interface ServiceHealth {
  service: string;
  status: 'connected' | 'error' | 'warning' | 'disabled';
  lastCheck: Date;
  latency?: number;
  message?: string;
  details?: Record<string, any>;
}

export interface PlatformHealth {
  overall: 'healthy' | 'degraded' | 'down';
  services: {
    firebase: ServiceHealth;
    firestore: ServiceHealth;
    auth: ServiceHealth;
    hosting: ServiceHealth;
    email: ServiceHealth;
    sms?: ServiceHealth;
    mercadoPago?: ServiceHealth;
    instagram?: ServiceHealth;
  };
  lastUpdate: Date;
}

// ============================================
// BILLING Y SUSCRIPCIONES
// ============================================

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'pro' | 'enterprise';
  
  // MercadoPago
  mercadoPagoId: string;
  paymentStatus: 'active' | 'pending' | 'cancelled' | 'failed';
  
  // Fechas
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  
  // Límites del plan
  limits: {
    maxGames: number;
    maxPlaysPerMonth: number;
    maxParticipants: number;
    customDomain: boolean;
    whiteLabel: boolean;
    analytics: boolean;
  };
  
  // Usage actual
  usage: {
    games: number;
    playsThisMonth: number;
    participants: number;
  };
}

// ============================================
// RESPUESTAS DE API
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
