// 🎯 HOOK DE RULETA NUEVO - DESDE CERO
// Lógica limpia para selección por probabilidades y animación

import { useState, useCallback, useRef } from 'react';
import { RouletteSectorNew, RouletteAnimationNew, RouletteSpinResultNew } from '../types/rouletteNew';

export const useRouletteNew = (sectors: RouletteSectorNew[]) => {
  const [animation, setAnimation] = useState<RouletteAnimationNew>({
    isSpinning: false,
    currentAngle: 0,
    duration: 0
  });

  const animationRef = useRef<number | undefined>(undefined);
  const [lastResult, setLastResult] = useState<RouletteSpinResultNew | null>(null);

  // Función para seleccionar ganador basado en probabilidades
  const selectWinner = useCallback((): RouletteSectorNew | null => {
    const activeSectors = sectors.filter(s => s.isActive);
    if (activeSectors.length === 0) return null;

    // Calcular probabilidad total
    const totalProbability = activeSectors.reduce((sum, sector) => {
      return sum + (sector.isPrize ? sector.probability : 0);
    }, 0);

    // Calcular probabilidad para no-premios
    const remainingProbability = Math.max(0, 100 - totalProbability);
    const nonPrizes = activeSectors.filter(s => !s.isPrize);
    const nonPrizeProbability = nonPrizes.length > 0 ? remainingProbability / nonPrizes.length : 0;

    // Crear array con probabilidades normalizadas
    const probabilityMap = activeSectors.map(sector => ({
      sector,
      probability: sector.isPrize ? sector.probability : nonPrizeProbability
    }));

    // Selección por probabilidades ponderadas
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const item of probabilityMap) {
      cumulative += item.probability;
      if (random <= cumulative) {
        return item.sector;
      }
    }

    // Fallback
    return activeSectors[0];
  }, [sectors]);

  // Función para calcular ángulo final basado en el sector ganador
  const calculateTargetAngle = useCallback((winnerSector: RouletteSectorNew): number => {
    const activeSectors = sectors.filter(s => s.isActive).sort((a, b) => a.order - b.order);
    const winnerIndex = activeSectors.findIndex(s => s.id === winnerSector.id);
    
    if (winnerIndex === -1) return 0;

    // Calcular ángulo del sector (dividir 360° entre sectores activos)
    const degreesPerSector = 360 / activeSectors.length;
    const sectorCenterAngle = winnerIndex * degreesPerSector;
    
    // Agregar vueltas extra (3-6 vueltas) + variación aleatoria dentro del sector
    const extraSpins = 3 + Math.random() * 3;
    const randomWithinSector = (Math.random() - 0.5) * degreesPerSector * 0.8;
    
    // Calcular ángulo final para que el ganador quede en la posición Norte (0°)
    const targetAngle = (360 * extraSpins) + (360 - sectorCenterAngle) + randomWithinSector;
    
    return targetAngle;
  }, [sectors]);

  // Función de animación con easing
  const animateRoulette = useCallback((
    startTime: number, 
    duration: number, 
    targetAngle: number,
    winnerSector: RouletteSectorNew
  ) => {
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function - easeOutQuart para desaceleración realista
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentAngle = targetAngle * easeOutQuart;
      
      setAnimation(prev => ({
        ...prev,
        currentAngle: currentAngle % 360
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animación completada
        setAnimation(prev => ({
          ...prev,
          isSpinning: false
        }));

        // Crear resultado
        const result: RouletteSpinResultNew = {
          winnerSector,
          finalAngle: targetAngle % 360,
          timestamp: new Date()
        };
        
        setLastResult(result);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Función principal para girar la ruleta
  const spin = useCallback(() => {
    if (animation.isSpinning) return;

    const winner = selectWinner();
    if (!winner) return;

    const targetAngle = calculateTargetAngle(winner);
    const duration = 3000 + Math.random() * 2000; // 3-5 segundos
    const startTime = performance.now();

    setAnimation({
      isSpinning: true,
      currentAngle: animation.currentAngle,
      duration,
      startTime
    });

    animateRoulette(startTime, duration, targetAngle, winner);
  }, [animation, selectWinner, calculateTargetAngle, animateRoulette]);

  // Función para resetear
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setAnimation({
      isSpinning: false,
      currentAngle: 0,
      duration: 0
    });
    
    setLastResult(null);
  }, []);

  return {
    animation,
    lastResult,
    spin,
    reset
  };
};
