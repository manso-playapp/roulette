# 📋 MEMO COMPLETO: FUNCIONES DE LA RULETA
**Fecha**: 5 de agosto de 2025  
**Propósito**: Documentación completa antes de reconstrucción desde cero

## 🎯 **COMPONENTES PRINCIPALES**

### **1. RouletteWheel.tsx**
- **Función**: Renderizado visual de la ruleta en canvas
- **Responsabilidades**:
  - Dibujar sectores con colores personalizados
  - Renderizar texto con rotación perpendicular al radio
  - Aplicar animaciones de rotación
  - Gestionar alta resolución (devicePixelRatio)
  - Dibujar flecha indicadora y centro

### **2. RoulettePreview.tsx**
- **Función**: Vista previa mejorada para editor
- **Responsabilidades**:
  - Mismo renderizado que RouletteWheel pero optimizado
  - Soporte para imágenes de fondo y bordes personalizados
  - Controles de prueba opcionales
  - Marcadores centrales personalizados

### **3. Roulette.tsx**
- **Función**: Componente principal orquestador
- **Responsabilidades**:
  - Integrar RouletteWheel con lógica de giro
  - Manejar estados de animación
  - Mostrar resultados y controles
  - Gestionar callbacks de eventos

## 🔧 **HOOKS Y LÓGICA**

### **4. useRoulette.tsx**
- **Función**: Lógica central de giro y animación
- **Características clave**:
  - **Selección de ganador**: Basada en probabilidades ponderadas
  - **Cálculo de ángulos**: Posicionamiento preciso del sector ganador
  - **Animación**: easeOutQuart para desaceleración realista
  - **Estado**: Gestiona isSpinning, currentAngle, targetAngle
  - **Fallbacks**: Sector por defecto si algo falla

### **5. useRouletteConfig.tsx**
- **Función**: Gestión completa de configuración
- **Operaciones disponibles**:
  - CRUD de sectores (crear, actualizar, eliminar, duplicar)
  - Reordenamiento (drag & drop simulation)
  - Cálculo automático de probabilidades
  - Validación de configuración
  - Copiar/pegar estilos entre sectores
  - Crear sectores de ejemplo

## 📊 **TIPOS Y ESTRUCTURA DE DATOS**

### **6. RouletteSector (Interface Principal)**
```typescript
{
  // Identificación
  id: string
  formalName: string        // Para sistema/emails
  displayName: string       // Mostrado en gajo
  
  // Configuración visual básica
  backgroundColor: string
  textColor: string
  fontSize: number          // px
  letterSpacing: number     // px
  lineHeight: number        // multiplicador
  distanceFromCenter: number // % del radio
  
  // Configuración de texto
  textLines: string[]       // Múltiples líneas
  fontFamily: string
  
  // Configuración visual avanzada
  borderImage?: string      // URL imagen borde
  centerIcon?: string       // URL icono central
  iconScale?: number        // 0.1 - 2.0
  borderWidth?: number      // 1-10px
  borderColor?: string
  
  // Líneas divisorias
  dividerEnabled?: boolean
  dividerWidth?: number
  dividerColor?: string
  
  // Texto curvo (experimental)
  curvedText?: boolean
  
  // Sistema de premios
  isPrize: boolean          // ¿Es premio?
  probability: number       // 1-100, solo si isPrize=true
  
  // Estado y posición
  isActive?: boolean
  order: number            // Posición en ruleta (0=Norte)
  
  // Propiedades avanzadas
  interlineSpacing?: number        // Espaciado entre líneas
  interletterSpacingLine2?: number // Espaciado línea 2
  borderScale?: number
  centerScale?: number
  lineThickness?: number
  lineColor?: string
  customIconUrl?: string
  centerImage?: string
  iconName?: string
}
```

### **7. ProbabilityDistribution**
- **Función**: Cálculo automático de probabilidades
- **Lógica**:
  - Premios: Suman sus probabilidades individuales
  - No-premios: Se reparten el % restante equitativamente
  - Validación: Suma total no excede 100%

## 🎨 **FUNCIONES DE PERSONALIZACIÓN**

### **8. Configuración de Texto**
- ✅ **Múltiples líneas**: Split por comas automático
- ✅ **Fuentes personalizadas**: fontFamily configurable
- ✅ **Tamaño dinámico**: fontSize respeta sliders
- ✅ **Espaciado**: letterSpacing y interlineSpacing
- ✅ **Posicionamiento**: distanceFromCenter (% del radio)
- ✅ **Rotación inteligente**: Perpendicular al radio, sin texto boca abajo

### **9. Configuración Visual**
- ✅ **Colores**: backgroundColor y textColor por sector
- ✅ **Bordes**: Imágenes personalizadas con escala
- ✅ **Centro**: Marcadores e iconos personalizados
- ✅ **Fondo**: Imágenes de fondo globales
- ✅ **Líneas divisorias**: Grosor y color configurables

### **10. Sistema de Probabilidades**
- ✅ **Premios**: Probabilidad individual 1-100%
- ✅ **No-premios**: Probabilidad automática del resto
- ✅ **Validación**: Suma no excede 100%
- ✅ **Distribución automática**: Reparto equitativo
- ✅ **Cálculo en tiempo real**: Actualización inmediata

## 🎬 **SISTEMA DE ANIMACIÓN**

### **11. RouletteAnimation (Interface)**
```typescript
{
  isSpinning: boolean
  currentAngle: number      // Ángulo actual
  targetAngle?: number      // Ángulo objetivo
  finalAngle?: number       // Ángulo final
  duration: number          // Duración en ms
  startTime?: number        // Timestamp inicio
  participantName?: string  // Para mostrar durante giro
}
```

### **12. Lógica de Giro**
1. **Selección**: Algoritmo weighted random por probabilidades
2. **Cálculo**: Ángulo exacto para posicionar ganador en Norte (0°)
3. **Animación**: easeOutQuart con 3-7 vueltas extra
4. **Resultado**: Callback con sector ganador y ángulo final

## 🔄 **GESTIÓN DE ESTADO**

### **13. Estados Principales**
- `config`: Configuración completa de la ruleta
- `animation`: Estado actual de animación
- `selectedSectorId`: Sector seleccionado en editor
- `isConfigMode`: Modo configuración vs. juego
- `probabilityDistribution`: Cálculos de probabilidad

### **14. Operaciones CRUD**
- **Crear**: `addSector()` con valores por defecto
- **Leer**: `selectedSector`, `config.sectors`
- **Actualizar**: `updateSector(id, changes)`
- **Eliminar**: `removeSector(id)` con reordenamiento

## 🎛️ **CONTROLES DE EDITOR**

### **15. Funciones Disponibles**
- ✅ **Drag & Drop**: Reordenamiento visual de sectores
- ✅ **Duplicar**: `duplicateSector()` con sufijo "(Copia)"
- ✅ **Copiar/Pegar estilo**: Transferir configuración visual
- ✅ **Mover**: `moveSector('up'|'down')`
- ✅ **Activar/Desactivar**: Toggle isActive
- ✅ **Sectores ejemplo**: `createExampleSectors()`

### **16. Validaciones**
- ✅ **Probabilidades**: Suma ≤ 100%
- ✅ **Sectores activos**: Mínimo 1 sector
- ✅ **Consistencia**: No-premios solo si sobra probabilidad
- ✅ **Configuración**: Validación antes de guardar

## 🎯 **RENDERIZADO Y CANVAS**

### **17. Técnicas Implementadas**
- ✅ **Alta resolución**: devicePixelRatio scaling
- ✅ **Texto perpendicular**: Rotación basada en midAngle
- ✅ **Anti-aliasing**: Smooth rendering
- ✅ **Letter-spacing**: Renderizado carácter por carácter
- ✅ **Recorte inteligente**: Truncado con "..." si es muy largo
- ✅ **Múltiples líneas**: Espaciado configurable

### **18. Elementos Visuales**
- **Sectores**: Gajos con colores y bordes
- **Textos**: Múltiples líneas, rotados, centrados
- **Centro**: Círculo blanco con borde
- **Flecha**: Indicador rojo apuntando hacia abajo
- **Fondo**: Opcional, imagen personalizada
- **Bordes**: Opcional, imagen con escala

## 🔗 **INTEGRACIÓN Y COMUNICACIÓN**

### **19. Props y Callbacks**
```typescript
// RouletteWheel
sectors: RouletteSector[]
animation: RouletteAnimation
probabilityDistribution?: ProbabilityDistribution

// Roulette
onSpinComplete?: (result) => void
disabled?: boolean

// Editor
onSectorSelect?: (id) => void
onConfigChange?: (config) => void
```

### **20. Flujo de Datos**
1. **Editor** → `useRouletteConfig` → **Estado**
2. **Estado** → **RoulettePreview** → **Vista Previa**
3. **Estado** → **Roulette** → **Juego**
4. **useRoulette** → **Animación** → **Resultado**

---

## 🚨 **PROBLEMAS CONOCIDOS ANTES DE RECONSTRUCCIÓN**

### **Problemas de Renderizado**:
- ❌ Algunos textos aparecen al revés
- ❌ Letter-spacing desplaza posición del texto
- ❌ distanceFromCenter no siempre respeta el valor
- ❌ interlineSpacing a veces no funciona
- ❌ fontSize limitado artificialmente

### **Problemas de Lógica**:
- ❌ Condición de rotación de texto inconsistente
- ❌ Múltiples `ctx.restore()` anidados
- ❌ Canvas sizing issues con diferentes DPR

---

## 📝 **CHECKLIST PARA RECONSTRUCCIÓN**

### **Mantener estas funciones**:
- ✅ Sistema completo de probabilidades
- ✅ CRUD de sectores con validación
- ✅ Personalización visual completa
- ✅ Animación con easing realista
- ✅ Múltiples líneas de texto
- ✅ Copiar/pegar estilos
- ✅ Drag & drop reordering
- ✅ Vista previa en tiempo real

### **Corregir estos problemas**:
- 🔧 Lógica de rotación de texto
- 🔧 Letter-spacing sin desplazamiento
- 🔧 Canvas scaling robusto
- 🔧 Renderizado de múltiples líneas
- 🔧 Límites dinámicos de fontSize

### **Arquitectura recomendada**:
1. **Separar lógica de renderizado** por funciones específicas
2. **Centralizar cálculos de texto** en utilities
3. **Simplificar gestión de contexto** de canvas
4. **Validar props** antes de renderizar
5. **Implementar tests unitarios** para lógica crítica

---

**¡LISTO PARA RECONSTRUCCIÓN! 🚀**
