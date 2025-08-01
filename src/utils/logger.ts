// 🔧 Logger configurado para optimizar rendimiento
// Solo muestra logs esenciales en desarrollo y nada en producción

const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
const isVerbose = false; // Cambiar a true solo para debugging intensivo

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(`ℹ️  ${message}`, ...args);
    }
  },
  
  success: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(`✅ ${message}`, ...args);
    }
  },
  
  warning: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`⚠️  ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`❌ ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDev && isVerbose) {
      console.log(`🔍 ${message}`, ...args);
    }
  },
  
  // Solo para casos críticos que necesitan verse siempre
  critical: (message: string, ...args: any[]) => {
    console.log(`🚨 ${message}`, ...args);
  }
};
