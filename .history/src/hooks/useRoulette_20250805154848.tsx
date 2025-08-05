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

  // Calcular ganador - ahora el sector en posición Norte (0°) es siempre el ganador
  const calculateWinner = useCallback((finalAngle: number): RouletteSector | null => {
    if (sectors.length === 0) return null;

    const activeSectors = sectors.filter(s => s.isActive).sort((a, b) => a.order - b.order);
    if (activeSectors.length === 0) return null;

    // Con la nueva lógica, el ganador siempre queda en posición Norte
    // Así que calculamos qué sector está en esa posición basado en el ángulo final
    const normalizedAngle = ((360 - (finalAngle % 360)) + 360) % 360;
    const degreesPerSector = 360 / activeSectors.length;
    const sectorIndex = Math.floor(normalizedAngle / degreesPerSector) % activeSectors.length;
    
    return activeSectors[sectorIndex] || activeSectors[0];
  }, [sectors]);

  // Nueva lógica: Seleccionar ganador primero, luego calcular ángulo para posición Norte
  const generateTargetAngleForWinner = useCallback((): { angle: number; winner: RouletteSector | null } => {
    const activeSectors = sectors.filter(s => s.isActive);
    if (activeSectors.length === 0) return { angle: Math.random() * 360, winner: null };

    // 1. Seleccionar sector ganador basado en probabilidades
    const totalProbability = activeSectors.reduce((sum, sector) => sum + sector.probability, 0);
    const normalizedSectors = activeSectors.map(sector => ({
      ...sector,
      normalizedProbability: sector.probability / totalProbability
    }));

    const random = Math.random();
    let cumulative = 0;
    let selectedSector: RouletteSector | null = null;
    let sectorIndex = 0;
    
    for (let i = 0; i < normalizedSectors.length; i++) {
      cumulative += normalizedSectors[i].normalizedProbability;
      if (random <= cumulative) {
        selectedSector = normalizedSectors[i];
        sectorIndex = i;
        break;
      }
    }

    // Fallback
    if (!selectedSector) {
      selectedSector = activeSectors[0];
      sectorIndex = 0;
    }

    // 2. Calcular ángulo para que el sector ganador quede en posición Norte (arriba)
    const degreesPerSector = 360 / activeSectors.length;
    const sectorStartAngle = sectorIndex * degreesPerSector;
    const sectorCenterAngle = sectorStartAngle + (degreesPerSector / 2);
    
    // 3. Posición aleatoria DENTRO del sector ganador (no siempre en el centro)
    const randomWithinSector = (Math.random() - 0.5) * degreesPerSector * 0.8; // 80% del sector para evitar bordes
    
    // 4. Agregar 6+ vueltas rápidas para espectacularidad
    const extraSpins = 6 + Math.random() * 2; // 6-8 vueltas
    
    // 5. Calcular ángulo final: vueltas + ángulo para llevar sector a Norte + variación
    // Norte está a 0°, así que necesitamos rotar para que el sector quede ahí
    const angleToNorth = 360 - sectorCenterAngle + randomWithinSector;
    const finalAngle = (360 * extraSpins) + angleToNorth;
    
    return { 
      angle: finalAngle, 
      winner: selectedSector 
    };
  }, [sectors]);

  // Función de animación mejorada con easing más realista
  const animateRoulette = useCallback((startTime: number, duration: number, targetAngle: number, preselectedWinner: RouletteSector | null) => {
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Usar easing precomputado para evitar cálculos repetitivos
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentAngle = targetAngle * easeOutQuart;

      setAnimation((prev) => ({
        ...prev,
        currentAngle,
        finalAngle: progress === 1 ? targetAngle : prev.finalAngle,
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        const result = {
          winnerSectorId: preselectedWinner?.id || '',
          winnerSector: preselectedWinner || sectors[0],
          isWinner: preselectedWinner?.isPrize || false,
          finalAngle: targetAngle,
          spinDuration: duration,
          timestamp: new Date(),
          participantInfo: {
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '',
            followsInstagram: false,
          },
        };

        setLastResult(result);
        setAnimation((prev) => ({
          ...prev,
          isSpinning: false,
        }));
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [sectors]);

  // Función principal para girar la ruleta con nueva lógica
  const spin = useCallback(() => {
    if (animation.isSpinning || sectors.filter(s => s.isActive).length === 0) {
      return;
    }

    // Cancelar animación anterior si existe
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // 1. Preseleccionar ganador y calcular ángulo objetivo
    const { angle: targetAngle, winner: preselectedWinner } = generateTargetAngleForWinner();
    
    // 2. Duración variable para mayor realismo (4-6 segundos)
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();

    // console.log('🎰 Sorteo realizado:', {
    //   winner: preselectedWinner?.label,
    //   targetAngle: Math.round(targetAngle),
    //   vueltas: Math.floor(targetAngle / 360),
    //   anguloFinal: Math.round(targetAngle % 360)
    // });

    setAnimation({
      isSpinning: true,
      currentAngle: 0,
      finalAngle: targetAngle,
      duration,
      startTime
    });

    animateRoulette(startTime, duration, targetAngle, preselectedWinner);
  }, [animation.isSpinning, sectors, generateTargetAngleForWinner, animateRoulette]);

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
