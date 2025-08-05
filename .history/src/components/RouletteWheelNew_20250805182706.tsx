// 🎯 COMPONENTE DE RULETA NUEVO - DESDE CERO
// Renderizado limpio en canvas sin contaminación

import React, { useRef, useEffect } from 'react';
import { RouletteSectorNew, RouletteAnimationNew } from '../types/rouletteNew';

interface RouletteWheelNewProps {
  sectors: RouletteSectorNew[];
  animation: RouletteAnimationNew;
  width?: number;
  height?: number;
  className?: string;
}

export const RouletteWheelNew: React.FC<RouletteWheelNewProps> = ({
  sectors,
  animation,
  width = 400,
  height = 400,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filtrar sectores activos y ordenarlos
  const activeSectors = React.useMemo(
    () => sectors.filter(s => s.isActive).sort((a, b) => a.order - b.order),
    [sectors]
  );

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

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Aplicar rotación de animación
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((animation.currentAngle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Dibujar sectores
    const totalSectors = activeSectors.length;
    activeSectors.forEach((sector, index) => {
      const startAngle = (index / totalSectors) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((index + 1) / totalSectors) * 2 * Math.PI - Math.PI / 2;

      // Dibujar sector
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = sector.backgroundColor;
      ctx.fill();
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dibujar texto (simple, centrado)
      const midAngle = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(midAngle) * textRadius;
      const textY = centerY + Math.sin(midAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(midAngle + Math.PI / 2);
      
      ctx.fillStyle = sector.textColor;
      ctx.font = `${sector.fontSize || 16}px ${sector.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText(sector.displayName, 0, 0);
      ctx.restore();
    });

    ctx.restore();

    // Dibujar centro
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dibujar flecha indicadora
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
        className="block rounded-full shadow-lg"
      />
      
      {/* Estado de animación */}
      {animation.isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg">
            <div className="font-bold">¡Girando...</div>
          </div>
        </div>
      )}
    </div>
  );
};
