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

  // Función principal de renderizado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeSectors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración del canvas para alta resolución
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 30;

    ctx.save();

    // Aplicar rotación de animación
    ctx.translate(centerX, centerY);
    ctx.rotate((animation.currentAngle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Renderizar cada sector
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

  // Función para renderizar un sector completo
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
    // Dibujar el sector (gajo)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    
    ctx.fillStyle = sector.backgroundColor || '#3B82F6';
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Renderizar texto del sector
    renderSectorText(ctx, sector, startAngle, endAngle, centerX, centerY, radius);
  };

  // Función corregida para renderizar texto
  const renderSectorText = (
    ctx: CanvasRenderingContext2D,
    sector: RouletteSector,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const midAngle = (startAngle + endAngle) / 2;
    
    // CORREGIR: Distancia desde el centro - usar el valor configurado
    const distanceFromCenter = (sector.distanceFromCenter ?? 65) / 100; // convertir % a decimal
    const textRadius = radius * distanceFromCenter;
    
    const textX = centerX + Math.cos(midAngle) * textRadius;
    const textY = centerY + Math.sin(midAngle) * textRadius;

    // Preparar líneas de texto
    let textLines: string[] = [];
    
    if (Array.isArray(sector.textLines) && 
        sector.textLines.length > 0 && 
        sector.textLines.some(line => line && line.trim() !== '')) {
      textLines = sector.textLines.filter(line => line && line.trim() !== '');
    } else if (sector.displayName && sector.displayName.includes(',')) {
      textLines = sector.displayName.split(',').map(line => line.trim()).filter(line => line);
    } else {
      textLines = [sector.displayName || `Premio ${sector.order}`];
    }

    // CORREGIR: Aplicar todas las configuraciones de texto correctamente
    const fontSize = sector.fontSize ?? 16;
    const fontFamily = sector.fontFamily || 'Arial, sans-serif';
    const letterSpacing = sector.letterSpacing ?? 0;
    const lineHeight = sector.lineHeight ?? 1.2;
    const interlineSpacing = sector.interlineSpacing ?? (fontSize * lineHeight);

    ctx.save();
    ctx.fillStyle = sector.textColor || '#FFFFFF';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calcular altura total del bloque de texto
    const totalTextHeight = textLines.length > 1 ? (textLines.length - 1) * interlineSpacing : 0;

    textLines.forEach((line, lineIndex) => {
      if (!line || !line.trim()) return;

      // Calcular offset Y para esta línea
      const yOffset = (lineIndex * interlineSpacing) - (totalTextHeight / 2);
      
      ctx.save();
      ctx.translate(textX, textY + yOffset);
      
      // CORREGIR: Rotación del texto - evitar texto al revés
      let textRotation = midAngle + Math.PI / 2;
      
      // Si el texto estaría boca abajo (entre 90° y 270°), rotarlo 180° más
      if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
        textRotation += Math.PI;
      }
      
      ctx.rotate(textRotation);

      // CORREGIR: Aplicar letter-spacing correctamente
      if (lineIndex === 1 && sector.interletterSpacingLine2 !== undefined) {
        // Usar espaciado específico para línea 2
        renderTextWithLetterSpacing(ctx, line, 0, 0, sector.interletterSpacingLine2);
      } else if (letterSpacing && letterSpacing !== 0) {
        // Usar espaciado general
        renderTextWithLetterSpacing(ctx, line, 0, 0, letterSpacing);
      } else {
        // Sin espaciado especial
        ctx.fillText(line, 0, 0);
      }
      
      ctx.restore();
    });

    ctx.restore();
  };

  // Función auxiliar para renderizar texto con letter-spacing
  const renderTextWithLetterSpacing = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    letterSpacing: number
  ) => {
    if (!letterSpacing || letterSpacing === 0) {
      ctx.fillText(text, x, y);
      return;
    }

    const chars = text.split('');
    let currentX = x - (getTextWidth(ctx, text, letterSpacing) / 2); // centrar

    chars.forEach((char, index) => {
      ctx.fillText(char, currentX, y);
      const charWidth = ctx.measureText(char).width;
      currentX += charWidth + letterSpacing;
    });
  };

  // Función auxiliar para calcular ancho de texto con letter-spacing
  const getTextWidth = (ctx: CanvasRenderingContext2D, text: string, letterSpacing: number): number => {
    const chars = text.split('');
    let totalWidth = 0;
    
    chars.forEach((char, index) => {
      totalWidth += ctx.measureText(char).width;
      if (index < chars.length - 1) {
        totalWidth += letterSpacing;
      }
    });
    
    return totalWidth;
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

  // Función para renderizar la flecha indicadora
  const renderPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.save();
    
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

  return (
    <div className={`relative ${className}`}>
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
