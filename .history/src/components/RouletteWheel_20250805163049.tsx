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
  
  // Log de depuración profundo: mostrar sectores recibidos
  // eslint-disable-next-line no-console
  console.log('RouletteWheel props.sectors:', sectors);

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
      ctx.save();
      const textRadius = radius * ((sector.distanceFromCenter ?? 70) / 100);
      const textX = centerX + Math.cos(midAngle) * textRadius;
      const textY = centerY + Math.sin(midAngle) * textRadius;
      ctx.translate(textX, textY);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.fillStyle = sector.textColor;
      ctx.font = `${sector.fontSize ?? 16}px ${sector.fontFamily || 'Roboto'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Si textLines está vacío o solo contiene strings vacíos, usar displayName
      let textLines: string[];
      if (Array.isArray(sector.textLines) && sector.textLines.length > 0 && sector.textLines.some(line => line.trim() !== '')) {
        // Copia profunda para evitar referencias compartidas
        textLines = sector.textLines.map(line => (line ? ('' + line) : ''));
      } else {
        textLines = [sector.displayName || `SECTOR ${i + 1}`];
      }
      // Log de depuración: mostrar el texto que se va a dibujar en cada gajo
      // eslint-disable-next-line no-console
      console.log(`Gajo #${i} (${sector.displayName}):`, textLines);
      const fontSize = sector.fontSize ?? 16;
      const lineHeight = sector.interlineSpacing ?? (fontSize * (sector.lineHeight ?? 1.2));
      const totalHeight = (textLines.length - 1) * lineHeight;
      for (let lineIndex = 0; lineIndex < textLines.length; lineIndex++) {
        const yOffset = (lineIndex * lineHeight) - (totalHeight / 2);
        ctx.fillText(textLines[lineIndex], 0, yOffset);
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
        style={{ width: '90%', height: 'auto', maxWidth: '90vw' }}
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
        <div className="mt-2 border-t border-white/20 pt-1">
          <div className="font-bold">Props.sectors:</div>
          <pre className="whitespace-pre-wrap break-all text-[10px] max-h-32 overflow-y-auto bg-black/40 p-1 rounded">
            {JSON.stringify(sectors, null, 2)}
          </pre>
        </div>
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
