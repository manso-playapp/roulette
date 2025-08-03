import { useState, useCallback, useRef } from 'react';
import { RouletteSector, RouletteSpinResult, RouletteAnimation } from '../types/roulette';

export const useRoulette = (sectors: RouletteSector[]) => {
  const [animation, setAnimation] = useState<RouletteAnimation>({
    isSpinning: false,
    currentAngle: 0,
    finalAngle: 0,
    duration: 0,
    startTime: 0
  });

  const animationRef = useRef<number | undefined>(undefined);
  const [lastResult, setLastResult] = useState<RouletteSpinResult | null>(null);

  // Calcular el ganador basado en el ángulo final
  const calculateWinner = useCallback((finalAngle: number): RouletteSector | null => {
    if (sectors.length === 0) return null;

    const activeSectors = sectors.filter(s => s.isActive).sort((a, b) => a.order - b.order);
    if (activeSectors.length === 0) return null;

    const degreesPerSector = 360 / activeSectors.length;
    
    // Normalizar el ángulo (0-360)
    const normalizedAngle = ((360 - (finalAngle % 360)) + 360) % 360;
    
    // Calcular qué sector corresponde (empezando desde el norte)
    const sectorIndex = Math.floor(normalizedAngle / degreesPerSector);
    
    return activeSectors[sectorIndex] || activeSectors[0];
  }, [sectors]);

  // Generar ángulo final considerando probabilidades
  const generateWeightedAngle = useCallback((): number => {
    const activeSectors = sectors.filter(s => s.isActive);
    if (activeSectors.length === 0) return Math.random() * 360;

    // Normalizar probabilidades
    const totalProbability = activeSectors.reduce((sum, sector) => sum + sector.probability, 0);
    const normalizedSectors = activeSectors.map(sector => ({
      ...sector,
      normalizedProbability: sector.probability / totalProbability
    }));

    // Seleccionar sector basado en probabilidades
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < normalizedSectors.length; i++) {
      cumulative += normalizedSectors[i].normalizedProbability;
      if (random <= cumulative) {
        const sectorIndex = i;
        const degreesPerSector = 360 / activeSectors.length;
        
        // Calcular ángulo dentro del sector (para que no siempre caiga en el centro)
        const sectorStartAngle = sectorIndex * degreesPerSector;
        const randomWithinSector = Math.random() * degreesPerSector;
        
        // Agregar vueltas completas para hacer el giro más espectacular
        const extraSpins = 3 + Math.random() * 3; // 3-6 vueltas extra
        
        return (360 * extraSpins) + sectorStartAngle + randomWithinSector;
      }
    }

    // Fallback
    return Math.random() * 360 + (360 * 4);
  }, [sectors]);

  // Función de animación
  const animateRoulette = useCallback((startTime: number, duration: number, targetAngle: number) => {
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Función de easing (ease-out cúbico para efecto realista)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = targetAngle * easeOut;

      setAnimation(prev => ({
        ...prev,
        currentAngle,
        finalAngle: progress === 1 ? targetAngle : prev.finalAngle
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animación terminada
        const winner = calculateWinner(targetAngle);
        const result: RouletteSpinResult = {
          winnerSectorId: winner?.id || '',
          winnerSector: winner || sectors[0], // Fallback al primer sector
          isWinner: winner?.isPrize || false,
          finalAngle: targetAngle,
          spinDuration: duration,
          timestamp: new Date(),
          participantInfo: {
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '',
            followsInstagram: false
          }
        };

        setLastResult(result);
        setAnimation(prev => ({
          ...prev,
          isSpinning: false
        }));
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [calculateWinner]);

  // Función principal para girar la ruleta
  const spin = useCallback(() => {
    if (animation.isSpinning || sectors.filter(s => s.isActive).length === 0) {
      return;
    }

    // Cancelar animación anterior si existe
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const targetAngle = generateWeightedAngle();
    const duration = 3000 + Math.random() * 2000; // 3-5 segundos
    const startTime = performance.now();

    setAnimation({
      isSpinning: true,
      currentAngle: 0,
      finalAngle: targetAngle,
      duration,
      startTime
    });

    animateRoulette(startTime, duration, targetAngle);
  }, [animation.isSpinning, sectors, generateWeightedAngle, animateRoulette]);

  // Función para resetear la ruleta
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setAnimation({
      isSpinning: false,
      currentAngle: 0,
      finalAngle: 0,
      duration: 0,
      startTime: 0
    });

    setLastResult(null);
  }, []);

  return {
    animation,
    lastResult,
    spin,
    reset,
    calculateWinner
  };
};
