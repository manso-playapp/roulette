// 🎛️ HOOK PARA RULETA AVANZADA - CON CONFIGURACIÓN VISUAL
// Version mejorada del hook básico con soporte para efectos visuales

import { useState, useCallback } from 'react';
import { RouletteSectorNew } from '../types/rouletteNew';
import { RouletteVisualConfig } from '../types/rouletteVisual';

interface UseRouletteAdvancedOptions {
  sectors: RouletteSectorNew[];
  visualConfig?: Partial<RouletteVisualConfig>;
  onSpinComplete?: (result: any) => void;
}

export const useRouletteAdvanced = ({
  sectors,
  visualConfig = {},
  onSpinComplete
}: UseRouletteAdvancedOptions) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);

  // Selección weighted random
  const selectWinner = useCallback((): RouletteSectorNew => {
    const activeSectors = sectors.filter(s => s.isActive);
    if (activeSectors.length === 0) return sectors[0];

    // Calcular probabilidades totales
    const prizes = activeSectors.filter(s => s.isPrize);
    const nonPrizes = activeSectors.filter(s => !s.isPrize);
    
    const totalPrizeProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
    const remainingProbability = Math.max(0, 100 - totalPrizeProbability);
    const nonPrizeProbabilityEach = nonPrizes.length > 0 ? remainingProbability / nonPrizes.length : 0;

    // Crear array con probabilidades
    const probabilityMap: { sector: RouletteSectorNew; probability: number }[] = [];
    
    prizes.forEach(sector => {
      probabilityMap.push({ sector, probability: sector.probability });
    });
    
    nonPrizes.forEach(sector => {
      probabilityMap.push({ sector, probability: nonPrizeProbabilityEach });
    });

    // Selección weighted random
    const totalWeight = probabilityMap.reduce((sum, item) => sum + item.probability, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of probabilityMap) {
      random -= item.probability;
      if (random <= 0) {
        return item.sector;
      }
    }
    
    return probabilityMap[0]?.sector || activeSectors[0];
  }, [sectors]);

  // Calcular ángulo objetivo
  const calculateTargetAngle = useCallback((winnerSector: RouletteSectorNew): number => {
    const activeSectors = sectors.filter(s => s.isActive);
    const sectorIndex = activeSectors.findIndex(s => s.id === winnerSector.id);
    
    if (sectorIndex === -1) return 0;
    
    const anglePerSector = 360 / activeSectors.length;
    const sectorAngle = sectorIndex * anglePerSector;
    
    // Ángulo del centro del sector
    const centerAngle = sectorAngle + (anglePerSector / 2);
    
    // Agregar vueltas completas (según configuración de animación)
    const minSpins = visualConfig.animation?.minSpins || 3;
    const maxSpins = visualConfig.animation?.maxSpins || 6;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const totalSpins = spins * 360;
    
    // Ángulo final (invertido porque giramos en sentido horario)
    return totalSpins + (360 - centerAngle);
  }, [sectors, visualConfig]);

  // Función de easing
  const easeOutQuart = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  }, []);

  // Animar la ruleta
  const animateRoulette = useCallback((targetAngle: number, duration: number) => {
    const startAngle = currentAngle;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easeOutQuart(progress);
      const newAngle = startAngle + (targetAngle - startAngle) * easedProgress;
      
      setCurrentAngle(newAngle);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [currentAngle, easeOutQuart]);

  // Función principal de giro
  const spin = useCallback(() => {
    if (isSpinning || sectors.length === 0) return;
    
    setIsSpinning(true);
    
    // Seleccionar ganador
    const winner = selectWinner();
    
    // Calcular ángulo objetivo
    const targetAngle = calculateTargetAngle(winner);
    
    // Duración de la animación
    const duration = visualConfig.animation?.duration || 3000;
    
    // Iniciar animación
    animateRoulette(targetAngle, duration);
    
    // Callback al completar (con delay para que termine la animación)
    setTimeout(() => {
      if (onSpinComplete) {
        onSpinComplete({
          winnerSector: winner,
          finalAngle: targetAngle,
          timestamp: new Date()
        });
      }
    }, duration);
    
  }, [
    isSpinning, 
    sectors, 
    selectWinner, 
    calculateTargetAngle, 
    animateRoulette, 
    visualConfig, 
    onSpinComplete
  ]);

  // Función para actualizar ángulo manualmente (para testing)
  const setAngle = useCallback((angle: number) => {
    if (!isSpinning) {
      setCurrentAngle(angle);
    }
  }, [isSpinning]);

  return {
    currentAngle,
    isSpinning,
    spin,
    setAngle
  };
};
