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

  const activeSectors = React.useMemo(
    () => sectorsWithProbabilities.filter(sector => sector.isActive).sort((a, b) => a.order - b.order),
    [sectorsWithProbabilities]
  );

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

    for (let index = 0; index < activeSectors.length; index++) {
      const sector = activeSectors[index];
      const startAngle = index * anglePerSector - Math.PI / 2;
      const endAngle = startAngle + anglePerSector;

      // Dibujar sector
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sector.backgroundColor;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Dibujar texto
      const textAngle = startAngle + anglePerSector / 2;
      ctx.save();
      // Forzar fuente segura y borde negro para máxima visibilidad
      const fontFamily = sector.fontFamily ? `${sector.fontFamily}, sans-serif` : 'sans-serif';
      const fontSize = sector.fontSize ?? 16;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = sector.textColor;
      if (sector.curvedText) {
        const textRadius = radius * ((sector.distanceFromCenter ?? 70) / 100);
        ctx.translate(centerX, centerY);
        ctx.rotate(textAngle);
        ctx.translate(0, -textRadius);
        const displayText = sector.displayName || `SECTOR ${index + 1}`;
        ctx.strokeText(displayText, 0, 0);
        ctx.fillText(displayText, 0, 0);
      } else {
        const textRadius = radius * ((sector.distanceFromCenter ?? 70) / 100);
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);
        const textLines = sector.textLines || [sector.displayName || `SECTOR ${index + 1}`];
        const lineHeight = sector.interlineSpacing ?? (fontSize * (sector.lineHeight ?? 1.2));
        const totalHeight = (textLines.length - 1) * lineHeight;
        for (let lineIndex = 0; lineIndex < textLines.length; lineIndex++) {
          const yOffset = (lineIndex * lineHeight) - (totalHeight / 2);
          ctx.strokeText(textLines[lineIndex], 0, yOffset);
          ctx.fillText(textLines[lineIndex], 0, yOffset);
        }
      }
      ctx.restore();

      // Dibujar imágenes personalizadas (solo si existen y son distintas por sector)
      if (sector.borderImage) {
        const borderImg = new window.Image();
        borderImg.src = sector.borderImage;
        borderImg.onload = () => {
          ctx.save();
          ctx.drawImage(borderImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
          ctx.restore();
        };
      }
      if (sector.centerImage) {
        const centerImg = new window.Image();
        centerImg.src = sector.centerImage;
        centerImg.onload = () => {
          ctx.save();
          ctx.drawImage(centerImg, centerX - 15, centerY - 15, 30, 30);
          ctx.restore();
        };
      }
    }

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

      {/* Overlay de depuración: muestra los sectores activos y sus propiedades */}
      <div className="absolute top-2 left-2 bg-black/80 text-white p-2 rounded text-xs z-50 max-h-60 overflow-y-auto" style={{minWidth: 220}}>
        <div className="font-bold mb-1">Sectores activos ({activeSectors.length}):</div>
        {activeSectors.map((s, i) => (
          <div key={s.id} className="mb-1 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{background: s.backgroundColor}} />
            <span>#{s.order}</span>
            <span className="font-mono">{s.displayName}</span>
            <span className="text-gray-400">({s.fontSize}px)</span>
          </div>
        ))}
      </div>

      {/* Información de estado */}
      {animation.isSpinning && animation.participantName && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center">
            <div className="font-bold">¡Girando para...</div>
            <div className="text-lg">{animation.participantName}</div>
          </div>
        </div>
      )}
    </div>
  );
};
