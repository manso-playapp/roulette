import React, { useRef, useEffect } from 'react';
import { RouletteSector, RouletteAnimation, ProbabilityDistribution } from '../types/roulette';

interface RouletteWheelProps {
  sectors: RouletteSector[];
  animation: RouletteAnimation;
  width?: number;
  height?: number;
  className?: string;
  probabilityDistribution?: ProbabilityDistribution;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  sectors,
  animation,
  width = 600,
  height = 600,
  className = '',
  probabilityDistribution
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calcular sectores con probabilidades efectivas
  const sectorsWithProbabilities = React.useMemo(() => {
    if (!probabilityDistribution) return sectors;

    return sectors.map(sector => ({
      ...sector,
      effectiveProbability: sector.isPrize 
        ? sector.probability 
        : probabilityDistribution.nonPrizesProbabilityEach
    }));
  }, [sectors, probabilityDistribution]);

  const activeSectors = sectorsWithProbabilities.filter(sector => sector.isActive);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeSectors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Aplicar rotación de animación
    ctx.translate(centerX, centerY);
    ctx.rotate((animation.currentAngle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Dibujar sectores
    const totalSectors = activeSectors.length;
    const anglePerSector = (2 * Math.PI) / totalSectors;

    activeSectors.forEach((sector, index) => {
      const startAngle = index * anglePerSector - Math.PI / 2; // Empezar desde arriba
      const endAngle = startAngle + anglePerSector;

      // Dibujar sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sector.backgroundColor;
      ctx.fill();
      
      // Borde del sector
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dibujar texto
      const textAngle = startAngle + anglePerSector / 2;
      const textRadius = radius * ((sector.distanceFromCenter ?? 70) / 100);
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);

      // Configurar fuente
      ctx.fillStyle = sector.textColor;
      const fontFamily = sector.fontFamily || 'Inter, Arial, sans-serif';
      ctx.font = `${sector.fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Dibujar cada línea de texto
      const fontSize = sector.fontSize ?? 16;
      const lineHeight = fontSize * (sector.lineHeight ?? 1.2);
      const textLines = sector.textLines ?? [sector.displayName];
      const totalHeight = (textLines.length - 1) * lineHeight;
      
      textLines.forEach((line, lineIndex) => {
        const yOffset = (lineIndex * lineHeight) - (totalHeight / 2);
        
        // Aplicar espaciado de letras manualmente si es diferente de 0
        const letterSpacing = sector.letterSpacing ?? 0;
        if (Math.abs(letterSpacing) > 0.1) { // Aplicar para valores positivos o negativos significativos
          const chars = line.split('');
          
          // Calcular ancho total correctamente
          let totalWidth = 0;
          chars.forEach((char: string) => {
            totalWidth += ctx.measureText(char).width;
          });
          // Agregar/quitar espacios entre caracteres (puede ser negativo)
          totalWidth += (chars.length - 1) * letterSpacing; 
          
          // Empezar desde la izquierda del texto centrado
          let currentX = -totalWidth / 2;
          chars.forEach((char: string, charIndex: number) => {
            ctx.fillText(char, currentX, yOffset);
            currentX += ctx.measureText(char).width + letterSpacing;
          });
        } else {
          // Usar el renderizado normal del canvas que está perfectamente centrado
          ctx.fillText(line, 0, yOffset);
        }
      });

      ctx.restore();

      // Mostrar probabilidad en modo debug - REMOVIDO
      // if (process.env.NODE_ENV === 'development') {
      //   const probX = centerX + Math.cos(textAngle) * (radius * 0.9);
      //   const probY = centerY + Math.sin(textAngle) * (radius * 0.9);
      //   
      //   ctx.save();
      //   ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      //   ctx.font = '10px Arial';
      //   ctx.textAlign = 'center';
      //   ctx.fillText(
      //     `${(sector as any).effectiveProbability?.toFixed(1) || sector.probability.toFixed(1)}%`, 
      //     probX, 
      //     probY
      //   );
      //   ctx.restore();
      // }
    });

    ctx.restore();

    // Dibujar el centro y la flecha
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dibujar flecha indicadora (apunta hacia abajo desde arriba)
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 15, 35);
    ctx.lineTo(centerX + 15, 35);
    ctx.closePath();
    ctx.fillStyle = '#FF4444';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [activeSectors, animation.currentAngle, width, height]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="block mx-auto rounded-full shadow-2xl"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Información de estado */}
      {animation.isSpinning && animation.participantName && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center">
            <div className="font-bold">¡Girando para...</div>
            <div className="text-lg">{animation.participantName}</div>
          </div>
        </div>
      )}

      {/* Debug info - REMOVIDO */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/50 text-white p-2 rounded text-xs">
          <div>Sectores activos: {activeSectors.length}</div>
          <div>Ángulo: {animation.currentAngle.toFixed(1)}°</div>
          {animation.isSpinning && (
            <div>Girando... {animation.participantName || 'Anónimo'}</div>
          )}
        </div>
      )} */}
    </div>
  );
};
