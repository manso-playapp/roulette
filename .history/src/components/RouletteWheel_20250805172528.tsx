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
  // Tamaño fijo del canvas en píxeles CSS y reales
  const visualWidth = 500;
  const visualHeight = 500;

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

    // Ajustar tamaño real del canvas para evitar pixelación
    const dpr = window.devicePixelRatio || 1;
    const realWidth = visualWidth * dpr;
    const realHeight = visualHeight * dpr;
    canvas.width = realWidth;
    canvas.height = realHeight;
    // Ajustar escala del contexto
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const centerX = visualWidth / 2;
    const centerY = visualHeight / 2;
    const radius = Math.min(visualWidth, visualHeight) / 2 - 20;

    // Limpiar canvas (doble clear y reset transform)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Aplicar rotación de animación
    ctx.translate(centerX, centerY);
    ctx.rotate((animation.currentAngle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Dibujar sectores
    const totalSectors = activeSectors.length;
    const anglePerSector = (2 * Math.PI) / totalSectors;


    // Renderizado robusto: cada sector activo y ordenado ocupa su propio gajo
    const orderedSectors = [...activeSectors].sort((a, b) => a.order - b.order);
    for (let i = 0; i < orderedSectors.length; i++) {
      const sector = orderedSectors[i];
      const startAngle = (i / orderedSectors.length) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((i + 1) / orderedSectors.length) * 2 * Math.PI - Math.PI / 2;

      // Dibujar gajo
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = sector.backgroundColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Texto del gajo
      const midAngle = (startAngle + endAngle) / 2;
      // Usar 60% del radio para evitar que el texto se salga
      const textRadius = radius * ((sector.distanceFromCenter ?? 60) / 100);
      const textX = centerX + Math.cos(midAngle) * textRadius;
      const textY = centerY + Math.sin(midAngle) * textRadius;
      ctx.save();
      ctx.fillStyle = sector.textColor;
      const fontPx = Math.max(8, Math.min(sector.fontSize ?? 16, 40));
      ctx.font = `${fontPx}px ${sector.fontFamily || 'Roboto'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Siempre priorizar displayName si existe, y solo usar textLines si son distintas y válidas
      let textLines: string[];
      if (
        Array.isArray(sector.textLines) &&
        sector.textLines.length > 0 &&
        sector.textLines.some(line => line.trim() !== '') &&
        // Solo usar textLines si NO son todas iguales al displayName
        !(sector.textLines.length === 1 && sector.textLines[0].trim() === sector.displayName?.trim())
      ) {
        textLines = sector.textLines.map(line => (line ? ('' + line) : ''));
      } else if (sector.displayName && sector.displayName.includes(',')) {
        // Si el displayName tiene comas, dividir en líneas (una línea por parte)
        textLines = sector.displayName.split(',').map(line => line.trim());
      } else {
        textLines = [sector.displayName || `SECTOR ${i + 1}`];
      }

      const fontSize = sector.fontSize ?? 16;
      const lineHeight = sector.interlineSpacing ?? (fontSize * (sector.lineHeight ?? 1.2));
      const totalHeight = (textLines.length - 1) * lineHeight;
      for (let lineIndex = 0; lineIndex < textLines.length; lineIndex++) {
        const yOffset = (lineIndex * lineHeight) - (totalHeight / 2);
        const line = textLines[lineIndex];
        // Interletrado: usar letterSpacing/interletrado para la línea 1 y interletrado línea 2 para la segunda
        let letterSpacing = 0;
        if (lineIndex === 1 && typeof sector.interletterSpacingLine2 === 'number' && sector.interletterSpacingLine2 > 0) {
          letterSpacing = sector.interletterSpacingLine2;
        } else if (typeof sector.letterSpacing === 'number' && sector.letterSpacing > 0) {
          letterSpacing = sector.letterSpacing;
        }

        if (sector.curvedText) {
          // Texto curvo: cada letra sigue la circunferencia de la ruleta según la distancia al centro
          ctx.save();
          ctx.translate(textX, textY);
          ctx.rotate(midAngle + Math.PI / 2);
          const chars = line.split('');
          const curvedRadius = textRadius;
          // Medir el ancho total del texto (con interletrado)
          let totalArc = 0;
          const charWidths = chars.map(char => {
            const w = ctx.measureText(char).width;
            totalArc += (w + letterSpacing) / curvedRadius;
            return w;
          });
          // Ángulo inicial para centrar el texto
          let startAngle = -totalArc / 2;
          for (let c = 0; c < chars.length; c++) {
            const char = chars[c];
            const w = charWidths[c];
            // Ángulo para este caracter
            const angle = (w + letterSpacing) / curvedRadius;
            ctx.save();
            ctx.rotate(startAngle + angle / 2); // Centrar cada letra en su arco
            ctx.translate(0, -curvedRadius);
            ctx.rotate(Math.PI / 2);
            ctx.fillText(char, 0, yOffset);
            ctx.restore();
            startAngle += angle;
          }
          ctx.restore();
        } else {
          // Texto normal (con o sin interletrado), horizontal y centrado en el radio
          ctx.save();
          ctx.translate(textX, textY + yOffset);
          if (letterSpacing > 0) {
            // Texto normal con interletrado manual
            let x = 0;
            for (let c = 0; c < line.length; c++) {
              const char = line[c];
              ctx.fillText(char, x, 0);
              // Medir ancho del caracter
              const charWidth = ctx.measureText(char).width;
              x += charWidth + letterSpacing;
            }
          } else {
            // Texto normal sin interletrado
            ctx.fillText(line, 0, 0);
          }
          ctx.restore();
        }
      }
      // Dibujar número grande del gajo para depuración visual
      ctx.font = `bold 28px Arial`;
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.5;
      ctx.fillText(`#${i + 1}`, 0, 40);
      ctx.globalAlpha = 1;
      ctx.restore();
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
        style={{ width: '500px', height: '500px', maxWidth: '500px', maxHeight: '500px', display: 'block' }}
        width={500 * (window.devicePixelRatio || 1)}
        height={500 * (window.devicePixelRatio || 1)}
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
    </div>
  );
};
