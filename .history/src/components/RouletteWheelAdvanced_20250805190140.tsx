// 🎨 RULETA AVANZADA CON MEJORAS VISUALES
// Soporte para múltiples líneas, sombras, efectos visuales

import React, { useRef, useEffect } from 'react';
import { RouletteSectorNew } from '../types/rouletteNew';
import { RouletteSectorMultiLine, RouletteVisualConfig, ROULETTE_PRESETS } from '../types/rouletteVisual';

interface RouletteWheelAdvancedProps {
  sectors: (RouletteSectorNew & Partial<RouletteSectorMultiLine>)[];
  currentAngle: number;
  size?: number;
  visualConfig?: Partial<RouletteVisualConfig>;
  preset?: keyof typeof ROULETTE_PRESETS;
}

export const RouletteWheelAdvanced: React.FC<RouletteWheelAdvancedProps> = ({
  sectors,
  currentAngle,
  size = 400,
  visualConfig = {},
  preset = 'modern'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Aplicar preset y configuración personalizada
  const config = {
    ...ROULETTE_PRESETS[preset],
    ...visualConfig
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || sectors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas para alta resolución
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    
    ctx.scale(dpr, dpr);
    
    // Limpiar canvas
    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - (config.borderWidth || 0) - 10;
    
    // Aplicar sombra global si está habilitada
    if (config.shadowEnabled) {
      ctx.shadowColor = config.shadowColor || 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = config.shadowBlur || 10;
      ctx.shadowOffsetX = config.shadowOffsetX || 0;
      ctx.shadowOffsetY = config.shadowOffsetY || 5;
    }

    // Dibujar sectores
    const anglePerSector = (2 * Math.PI) / sectors.length;
    
    sectors.forEach((sector, index) => {
      if (!sector.isActive) return;
      
      const startAngle = (index * anglePerSector) + (currentAngle * Math.PI / 180);
      const endAngle = startAngle + anglePerSector;
      
      // Dibujar sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Aplicar color de fondo
      ctx.fillStyle = sector.backgroundColor;
      ctx.fill();
      
      // Borde del sector (opcional)
      if (config.borderWidth && config.borderWidth > 0) {
        ctx.strokeStyle = config.borderColor || '#FFFFFF';
        ctx.lineWidth = config.borderWidth;
        ctx.stroke();
      }
      
      // Configurar texto
      const fontSize = sector.fontSize || 16;
      const fontFamily = sector.fontFamily || 'Arial';
      const fontWeight = (sector as RouletteSectorMultiLine).fontWeight || 'normal';
      
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = sector.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Aplicar sombra al texto si está configurada
      const textShadow = (sector as RouletteSectorMultiLine).textShadow;
      if (textShadow?.enabled) {
        ctx.shadowColor = textShadow.color;
        ctx.shadowBlur = textShadow.blur;
        ctx.shadowOffsetX = textShadow.offsetX;
        ctx.shadowOffsetY = textShadow.offsetY;
      } else {
        // Limpiar sombra del texto si no está habilitada
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      
      // Aplicar letter spacing si está configurado
      const letterSpacing = (sector as RouletteSectorMultiLine).letterSpacing || 0;
      if (letterSpacing > 0) {
        ctx.letterSpacing = `${letterSpacing}px`;
      }
      
      // Calcular posición del texto
      const textAngle = startAngle + (anglePerSector / 2);
      const textRadius = radius * 0.7; // 70% del radio
      
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;
      
      // Rotar el contexto para texto perpendicular
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      
      // Soporte para múltiples líneas
      const textLines = sector.textLines || [sector.displayName];
      const lineSpacing = fontSize * 0.2;
      const maxLines = Math.min(textLines.length, 3);
      
      // Calcular posición inicial para centrar verticalmente
      const totalTextHeight = (maxLines - 1) * (fontSize + lineSpacing);
      let startY = -totalTextHeight / 2;
      
      // Dibujar cada línea
      for (let i = 0; i < maxLines; i++) {
        if (textLines[i]) {
          const lineY = startY + (i * (fontSize + lineSpacing));
          
          // Aplicar diferentes tamaños por línea si es necesario
          if (i === 0 && textLines.length > 1) {
            // Primera línea ligeramente más grande
            ctx.font = `${fontWeight} ${fontSize * 1.1}px ${fontFamily}`;
          } else {
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          }
          
          ctx.fillText(textLines[i], 0, lineY);
        }
      }
      
      ctx.restore();
    });
    
    // Resetear sombra global
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Dibujar círculo central si está habilitado
    if (config.centerCircle?.enabled) {
      const centerConfig = config.centerCircle;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerConfig.radius, 0, 2 * Math.PI);
      ctx.fillStyle = centerConfig.color;
      ctx.fill();
      
      if (centerConfig.borderWidth && centerConfig.borderWidth > 0) {
        ctx.strokeStyle = centerConfig.borderColor || '#000000';
        ctx.lineWidth = centerConfig.borderWidth;
        ctx.stroke();
      }
    }
    
    // Dibujar flecha indicadora si está habilitada
    if (config.arrow?.enabled) {
      const arrowConfig = config.arrow;
      const arrowSize = arrowConfig.size;
      
      // Posición de la flecha según configuración
      let arrowX = centerX;
      let arrowY = centerY;
      
      switch (arrowConfig.position) {
        case 'top':
          arrowY = 20;
          break;
        case 'right':
          arrowX = size - 20;
          arrowY = centerY;
          break;
        case 'bottom':
          arrowY = size - 20;
          break;
        case 'left':
          arrowX = 20;
          arrowY = centerY;
          break;
      }
      
      ctx.fillStyle = arrowConfig.color;
      ctx.strokeStyle = arrowConfig.color;
      ctx.lineWidth = 2;
      
      if (arrowConfig.style === 'triangle') {
        // Flecha triangular
        ctx.beginPath();
        if (arrowConfig.position === 'top') {
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - arrowSize/2, arrowY + arrowSize);
          ctx.lineTo(arrowX + arrowSize/2, arrowY + arrowSize);
        } else if (arrowConfig.position === 'bottom') {
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - arrowSize/2, arrowY - arrowSize);
          ctx.lineTo(arrowX + arrowSize/2, arrowY - arrowSize);
        }
        // ... otros casos para right/left si es necesario
        ctx.closePath();
        ctx.fill();
      } else if (arrowConfig.style === 'line') {
        // Flecha de línea simple
        ctx.beginPath();
        if (arrowConfig.position === 'top') {
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX, arrowY + arrowSize);
        }
        // ... otros casos
        ctx.stroke();
      }
    }
    
  }, [sectors, currentAngle, size, config]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-full"
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};
