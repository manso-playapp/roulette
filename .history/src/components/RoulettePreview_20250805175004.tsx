import React, { useRef, useEffect } from 'react';
import { RouletteSector, RouletteAnimation, ProbabilityDistribution } from '../types/roulette';

interface RoulettePreviewProps {
  sectors: RouletteSector[];
  animation?: RouletteAnimation;
  width?: number;
  height?: number;
  className?: string;
  probabilityDistribution?: ProbabilityDistribution;
  backgroundImage?: string;
  borderImage?: string;
  borderSize?: number;
  centerMarkerImage?: string;
  centerMarkerSize?: number;
  showControls?: boolean;
  onTestSpin?: () => void;
}

export const RoulettePreview: React.FC<RoulettePreviewProps> = ({
  sectors,
  animation = { isSpinning: false, currentAngle: 0, targetAngle: 0, duration: 0 },
  width = 400,
  height = 400,
  className = '',
  probabilityDistribution,
  backgroundImage,
  borderImage,
  borderSize = 1,
  centerMarkerImage,
  centerMarkerSize = 2,
  showControls = false,
  onTestSpin
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Filtrar y ordenar sectores activos
  const activeSectors = React.useMemo(
    () => sectorsWithProbabilities
      .filter(sector => sector.isActive !== false)
      .sort((a, b) => a.order - b.order),
    [sectorsWithProbabilities]
  );

  // Función para renderizar un sector
  const renderSector = (
    ctx: CanvasRenderingContext2D,
    sector: RouletteSector,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number,
    radius: number,
    index: number
  ) => {
    // Dibujar el sector
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    
    // Aplicar color de fondo
    ctx.fillStyle = sector.backgroundColor || '#3B82F6';
    ctx.fill();
    
    // Borde del sector
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Renderizar texto del sector
    renderSectorText(ctx, sector, startAngle, endAngle, centerX, centerY, radius, index);
  };

  // Función para renderizar texto de un sector
  const renderSectorText = (
    ctx: CanvasRenderingContext2D,
    sector: RouletteSector,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number,
    radius: number,
    index: number
  ) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius * 0.65;
    const textX = centerX + Math.cos(midAngle) * textRadius;
    const textY = centerY + Math.sin(midAngle) * textRadius;

    ctx.save();
    ctx.fillStyle = sector.textColor || '#FFFFFF';
    
    // Configurar fuente
    const fontSize = Math.max(10, Math.min(sector.fontSize ?? 16, 24));
    const fontFamily = sector.fontFamily || 'Arial, sans-serif';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Preparar líneas de texto
    let textLines: string[] = [];
    
    if (Array.isArray(sector.textLines) && 
        sector.textLines.length > 0 && 
        sector.textLines.some(line => line.trim() !== '') &&
        !(sector.textLines.length === 1 && sector.textLines[0].trim() === sector.displayName?.trim())) {
      textLines = sector.textLines.map(line => String(line || ''));
    } else if (sector.displayName && sector.displayName.includes(',')) {
      textLines = sector.displayName.split(',').map(line => line.trim());
    } else {
      textLines = [sector.displayName || `Premio ${index + 1}`];
    }

    // Calcular espaciado entre líneas
    const lineHeight = sector.interlineSpacing ?? (fontSize * (sector.lineHeight ?? 1.2));
    const totalHeight = (textLines.length - 1) * lineHeight;

    // Renderizar cada línea de texto
    textLines.forEach((line, lineIndex) => {
      if (!line.trim()) return;

      const yOffset = (lineIndex * lineHeight) - (totalHeight / 2);
      
      ctx.save();
      ctx.translate(textX, textY + yOffset);
      
      // Calcular rotación para que el texto sea perpendicular al radio
      let textRotation = midAngle + Math.PI / 2;
      
      // Si el texto estaría boca abajo, rotarlo para legibilidad
      if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
        textRotation += Math.PI;
      }
      
      ctx.rotate(textRotation);
      
      // Recortar texto si es muy largo
      let renderLine = line;
      const sectorAngle = endAngle - startAngle;
      const maxTextWidth = Math.min(radius * 0.7, (textRadius * sectorAngle) * 0.9);
      
      if (ctx.measureText(renderLine).width > maxTextWidth) {
        while (renderLine.length > 1 && ctx.measureText(renderLine + '...').width > maxTextWidth) {
          renderLine = renderLine.slice(0, -1);
        }
        if (renderLine.length > 0) {
          renderLine += '...';
        }
      }
      
      ctx.fillText(renderLine, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  };

  // Función para renderizar la flecha indicadora
  const renderPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.save();
    
    // Flecha apuntando hacia abajo desde arriba
    ctx.beginPath();
    ctx.moveTo(centerX, 15);
    ctx.lineTo(centerX - 15, 40);
    ctx.lineTo(centerX + 15, 40);
    ctx.closePath();
    
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  };

  // Función para renderizar el centro
  const renderCenter = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.save();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  };

  // Efecto principal de renderizado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeSectors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración del canvas para alta resolución
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = width;
    const displayHeight = height;
    
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const radius = Math.min(displayWidth, displayHeight) / 2 - 30;

    ctx.save();

    // Aplicar rotación de animación
    ctx.translate(centerX, centerY);
    ctx.rotate((animation.currentAngle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Renderizar sectores
    const totalSectors = activeSectors.length;
    activeSectors.forEach((sector, index) => {
      const startAngle = (index / totalSectors) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((index + 1) / totalSectors) * 2 * Math.PI - Math.PI / 2;
      
      renderSector(ctx, sector, startAngle, endAngle, centerX, centerY, radius, index);
    });

    ctx.restore();

    // Renderizar elementos fijos (no rotan)
    renderCenter(ctx, centerX, centerY);
    renderPointer(ctx, centerX, centerY);

  }, [activeSectors, animation.currentAngle, width, height]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Imagen de fondo */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Canvas de la ruleta */}
      <div className="relative z-10 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="block rounded-full shadow-lg"
        />
        
        {/* Borde personalizado */}
        {borderImage && (
          <img 
            src={borderImage} 
            alt="Borde personalizado" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              width: `${width + (borderSize * 50)}px`, 
              height: `${height + (borderSize * 50)}px`
            }}
          />
        )}
        
        {/* Marcador central personalizado */}
        {centerMarkerImage && (
          <img 
            src={centerMarkerImage} 
            alt="Marcador central" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ 
              width: `${centerMarkerSize * 15}px`, 
              height: `${centerMarkerSize * 15}px`
            }}
          />
        )}
      </div>

      {/* Controles de prueba */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={onTestSpin}
            disabled={animation.isSpinning}
            className={`px-6 py-2 rounded-full text-white font-semibold shadow-lg transition-all ${
              animation.isSpinning 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            }`}
          >
            {animation.isSpinning ? 'Girando...' : '🎰 Girar'}
          </button>
        </div>
      )}

      {/* Información de estado */}
      {animation.isSpinning && animation.participantName && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="bg-black/80 text-white px-6 py-3 rounded-lg text-center backdrop-blur-sm">
            <div className="font-bold text-lg">¡Girando para...</div>
            <div className="text-xl">{animation.participantName}</div>
          </div>
        </div>
      )}
    </div>
  );
};
