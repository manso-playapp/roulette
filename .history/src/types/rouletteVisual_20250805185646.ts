// 🎨 MEJORAS VISUALES - SOPORTE PARA MÚLTIPLES LÍNEAS
// Extensión de tipos para textos multi-línea

export interface RouletteSectorMultiLine extends RouletteSectorNew {
  textLines?: string[];           // Array de líneas de texto
  lineSpacing?: number;          // Espaciado entre líneas (px)
  maxLines?: number;             // Máximo número de líneas permitidas
  textAlign?: 'center' | 'left' | 'right'; // Alineación del texto
  verticalAlign?: 'center' | 'top' | 'bottom'; // Alineación vertical
  letterSpacing?: number;        // Espaciado entre letras (px)
  fontWeight?: 'normal' | 'bold' | 'bolder' | number; // Peso de la fuente
  textShadow?: {                 // Sombra del texto
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
}

export interface RouletteVisualConfig {
  // Configuración global de la ruleta
  diameter?: number;             // Diámetro en pixels
  borderWidth?: number;          // Grosor del borde
  borderColor?: string;          // Color del borde
  shadowEnabled?: boolean;       // Habilitar sombra
  shadowColor?: string;          // Color de la sombra
  shadowBlur?: number;           // Difuminado de la sombra
  shadowOffsetX?: number;        // Desplazamiento X de la sombra
  shadowOffsetY?: number;        // Desplazamiento Y de la sombra
  
  // Configuración del centro
  centerCircle?: {
    enabled: boolean;
    color: string;
    radius: number;
    borderColor?: string;
    borderWidth?: number;
  };
  
  // Configuración de la flecha
  arrow?: {
    enabled: boolean;
    color: string;
    size: number;
    position: 'top' | 'right' | 'bottom' | 'left';
    style: 'triangle' | 'line' | 'custom';
  };
  
  // Animación
  animation?: {
    duration: number;            // Duración en ms
    easing: 'linear' | 'easeOut' | 'easeInOut' | 'bounce';
    minSpins: number;           // Mínimo número de vueltas
    maxSpins: number;           // Máximo número de vueltas
  };
}

// Presets predefinidos para diferentes estilos
export const ROULETTE_PRESETS = {
  'modern': {
    borderWidth: 4,
    borderColor: '#E5E7EB',
    shadowEnabled: true,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowBlur: 20,
    shadowOffsetX: 0,
    shadowOffsetY: 10,
    centerCircle: {
      enabled: true,
      color: '#FFFFFF',
      radius: 30,
      borderColor: '#9CA3AF',
      borderWidth: 2
    },
    arrow: {
      enabled: true,
      color: '#374151',
      size: 20,
      position: 'top' as const,
      style: 'triangle' as const
    }
  },
  
  'classic': {
    borderWidth: 8,
    borderColor: '#8B5CF6',
    shadowEnabled: false,
    centerCircle: {
      enabled: true,
      color: '#8B5CF6',
      radius: 25,
      borderColor: '#FFFFFF',
      borderWidth: 3
    },
    arrow: {
      enabled: true,
      color: '#8B5CF6',
      size: 25,
      position: 'top' as const,
      style: 'triangle' as const
    }
  },
  
  'neon': {
    borderWidth: 2,
    borderColor: '#06B6D4',
    shadowEnabled: true,
    shadowColor: 'rgba(6, 182, 212, 0.5)',
    shadowBlur: 30,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    centerCircle: {
      enabled: true,
      color: '#0F172A',
      radius: 35,
      borderColor: '#06B6D4',
      borderWidth: 2
    },
    arrow: {
      enabled: true,
      color: '#06B6D4',
      size: 18,
      position: 'top' as const,
      style: 'triangle' as const
    }
  },
  
  'minimal': {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowEnabled: false,
    centerCircle: {
      enabled: false,
      color: '#FFFFFF',
      radius: 20
    },
    arrow: {
      enabled: true,
      color: '#6B7280',
      size: 15,
      position: 'top' as const,
      style: 'line' as const
    }
  }
} as const;

export type RoulettePresetName = keyof typeof ROULETTE_PRESETS;
