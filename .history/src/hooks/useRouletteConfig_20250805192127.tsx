import { useState, useCallback, useMemo } from 'react';
import { 
  RouletteConfig, 
  RouletteSector, 
  SectorEditConfig, 
  ProbabilityDistribution 
} from '../types/roulette';

export const useRouletteConfig = () => {
  const [config, setConfig] = useState<RouletteConfig>({
    id: crypto.randomUUID(),
    name: 'Nueva Ruleta',
    description: '',
    
    // Información del cliente - valores por defecto
    clientName: '',
    clientEmail: '',
    clientInstagram: '',
    verificationEmail: '',
    
    sectors: [],
    
    // Estado del sistema
    isActive: false,
    isDemoMode: true, // Por defecto en modo demo
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    
    instagramAccount: '',
    welcomeMessage: '¡Participa y gana increíbles premios!'
  });

  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [isConfigMode, setIsConfigMode] = useState(false);
  
  // Estado para copiar/pegar estilo
  const [copiedStyle, setCopiedStyle] = useState<Partial<RouletteSector> | null>(null);

  // Crear un nuevo sector con valores por defecto
  const createNewSector = useCallback((): RouletteSector => {
    const order = config.sectors.length;
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB6C1'
    ];
    
    return {
      id: crypto.randomUUID(),
      formalName: `Premio ${order + 1}`,
      displayName: `PREMIO ${order + 1}`,
      backgroundColor: colors[order % colors.length],
      textColor: '#FFFFFF',
      fontSize: 16,
      letterSpacing: 0,
      lineHeight: 1.2,
      distanceFromCenter: 70,
      textLines: [`PREMIO ${order + 1}`],
      fontFamily: 'Roboto',
      isPrize: true,
      probability: Math.floor(100 / Math.max(1, config.sectors.length + 1)),
      isActive: true,
      order: order,
      minAngle: 0,
      maxAngle: 360,
      
      // Valores por defecto para nuevas propiedades
      curvedText: false,
      interlineSpacing: 2,
      interletterSpacingLine2: 0,
      borderImage: '',
      centerImage: '',
      borderScale: 1,
      centerScale: 1,
      lineThickness: 2,
      lineColor: '#FFFFFF',
      iconName: '',
      iconScale: 1,
      customIconUrl: ''
    };
  }, [config.sectors.length]);

  // Agregar un nuevo sector
  const addSector = useCallback(() => {
    const newSector = createNewSector();
    setConfig(prev => ({
      ...prev,
      sectors: [...prev.sectors, newSector],
      updatedAt: new Date()
    }));
    setSelectedSectorId(newSector.id);
  }, [createNewSector]);

  // Actualizar un sector específico
  const updateSector = useCallback((sectorId: string, updates: Partial<SectorEditConfig>) => {
    setConfig(prev => ({
      ...prev,
      sectors: prev.sectors.map(sector => 
        sector.id === sectorId ? { ...sector, ...updates } : sector
      ),
      updatedAt: new Date()
    }));
  }, []);

  // Eliminar un sector
  const removeSector = useCallback((sectorId: string) => {
    setConfig(prev => ({
      ...prev,
      sectors: prev.sectors
        .filter(sector => sector.id !== sectorId)
        .map((sector, index) => ({ ...sector, order: index })),
      updatedAt: new Date()
    }));
    
    if (selectedSectorId === sectorId) {
      setSelectedSectorId(null);
    }
  }, [selectedSectorId]);

  // Duplicar un sector
  const duplicateSector = useCallback((sectorId: string) => {
    const sectorToDuplicate = config.sectors.find(s => s.id === sectorId);
    if (!sectorToDuplicate) return;

    const duplicated: RouletteSector = {
      ...sectorToDuplicate,
      id: crypto.randomUUID(),
      formalName: `${sectorToDuplicate.formalName} (Copia)`,
      displayName: `${sectorToDuplicate.displayName} COPIA`,
      order: config.sectors.length
    };

    setConfig(prev => ({
      ...prev,
      sectors: [...prev.sectors, duplicated],
      updatedAt: new Date()
    }));
  }, [config.sectors]);

  // Reordenar sectors
  const reorderSectors = useCallback((fromIndex: number, toIndex: number) => {
    setConfig(prev => {
      const newSectors = [...prev.sectors];
      const [removed] = newSectors.splice(fromIndex, 1);
      newSectors.splice(toIndex, 0, removed);
      
      // Actualizar order
      const reorderedSectors = newSectors.map((sector, index) => ({
        ...sector,
        order: index
      }));

      return {
        ...prev,
        sectors: reorderedSectors,
        updatedAt: new Date()
      };
    });
  }, []);

  // Copiar estilo de un sector
  const copyStyle = useCallback((sectorId: string) => {
    const sector = config.sectors.find(s => s.id === sectorId);
    if (sector) {
      setCopiedStyle({
        backgroundColor: sector.backgroundColor,
        textColor: sector.textColor,
        fontSize: sector.fontSize,
        letterSpacing: sector.letterSpacing,
        lineHeight: sector.lineHeight,
        fontFamily: sector.fontFamily,
        distanceFromCenter: sector.distanceFromCenter,
        curvedText: sector.curvedText,
        interlineSpacing: sector.interlineSpacing,
        interletterSpacingLine2: sector.interletterSpacingLine2,
        borderImage: sector.borderImage,
        centerImage: sector.centerImage,
        borderScale: sector.borderScale,
        centerScale: sector.centerScale,
        lineThickness: sector.lineThickness,
        lineColor: sector.lineColor,
        iconName: sector.iconName,
        iconScale: sector.iconScale,
        customIconUrl: sector.customIconUrl,
        // Asegura que todos los campos tipográficos y de estilo estén presentes
        textLines: sector.textLines,
        // Si se agregan más campos en el futuro, incluirlos aquí
      });
    }
  }, [config.sectors]);

  // Pegar estilo a un sector
  const pasteStyle = useCallback((sectorId: string) => {
    if (copiedStyle) {
      updateSector(sectorId, copiedStyle);
    }
  }, [copiedStyle, updateSector]);

  // Función para mover un sector hacia arriba o abajo
  const moveSector = useCallback((sectorId: string, direction: 'up' | 'down') => {
    const currentIndex = config.sectors.findIndex(s => s.id === sectorId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < config.sectors.length) {
      reorderSectors(currentIndex, newIndex);
    }
  }, [config.sectors, reorderSectors]);

  // Calcular distribución de probabilidades
  const probabilityDistribution = useMemo((): ProbabilityDistribution => {
    const prizes = config.sectors.filter(s => s.isPrize && s.isActive);
    const nonPrizes = config.sectors.filter(s => !s.isPrize && s.isActive);
    
    const prizesProbabilitySum = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    const totalPrizes = prizes.length;
    const totalNonPrizes = nonPrizes.length;
    
    // Calcular probabilidad para NO premios
    const remainingProbability = Math.max(0, 100 - prizesProbabilitySum);
    const nonPrizesProbabilityEach = totalNonPrizes > 0 ? remainingProbability / totalNonPrizes : 0;
    
    const errors: string[] = [];
    
    if (prizesProbabilitySum > 100) {
      errors.push('La suma de probabilidades de premios excede el 100%');
    }
    
    if (totalPrizes === 0 && totalNonPrizes === 0) {
      errors.push('Debe haber al menos un sector activo');
    }
    
    if (prizesProbabilitySum === 100 && totalNonPrizes > 0) {
      errors.push('Con 100% de premios, no pueden existir sectores de "no premio"');
    }

    return {
      totalPrizes,
      totalNonPrizes,
      prizesProbabilitySum,
      nonPrizesProbabilityEach,
      isValid: errors.length === 0,
      errors
    };
  }, [config.sectors]);

  // Actualizar texto de un sector (separado por comas)
  const updateSectorText = useCallback((sectorId: string, text: string) => {
    // Procesar automáticamente las comas para saltos de línea
    const textLines = text.split(',').map(line => line.trim()).filter(line => line.length > 0);
    
    // Máximo 3 líneas para mejor legibilidad
    if (textLines.length > 3) {
      textLines.splice(3);
    }
    
    updateSector(sectorId, { 
      textLines,
      displayName: text // Mantener el texto original
    });
  }, [updateSector]);

  // Aplicar distribución automática de probabilidades
  const autoDistributeProbabilities = useCallback(() => {
    const activeSectors = config.sectors.filter(s => s.isActive);
    const prizes = activeSectors.filter(s => s.isPrize);
    const nonPrizes = activeSectors.filter(s => !s.isPrize);
    
    if (prizes.length === 0) return;
    
    // Distribuir equitativamente entre premios (dejando espacio para no premios)
    const targetPrizeProbability = nonPrizes.length > 0 ? 80 : 100;
    const probabilityPerPrize = Math.floor(targetPrizeProbability / prizes.length);
    
    setConfig(prev => ({
      ...prev,
      sectors: prev.sectors.map(sector => {
        if (sector.isPrize && sector.isActive) {
          return { ...sector, probability: probabilityPerPrize };
        }
        return sector;
      }),
      updatedAt: new Date()
    }));
  }, [config.sectors]);

  // Crear sectores de ejemplo
  const createExampleSectors = useCallback(() => {
    const exampleSectors: RouletteSector[] = [
      {
        id: crypto.randomUUID(),
        formalName: 'Premio Principal',
        displayName: 'PREMIO PRINCIPAL',
        backgroundColor: '#FF6B6B',
        textColor: '#FFFFFF',
        fontSize: 16,
        letterSpacing: 1,
        lineHeight: 1.1,
        distanceFromCenter: 70,
        textLines: ['PREMIO', 'PRINCIPAL'],
        fontFamily: 'Bebas Neue',
        isPrize: true,
        probability: 5,
        isActive: true,
        order: 0,
        interlineSpacing: 1.8, // Correctly define the new property
        curvedText: true
      },
      {
        id: crypto.randomUUID(),
        formalName: 'Descuento 20%',
        displayName: '20% DESCUENTO',
        backgroundColor: '#4ECDC4',
        textColor: '#FFFFFF',
        fontSize: 18,
        letterSpacing: 1,
        lineHeight: 1.2,
        distanceFromCenter: 70,
        textLines: ['20%', 'DESCUENTO'],
        fontFamily: 'Bebas Neue',
        isPrize: true,
        probability: 15,
        isActive: true,
        order: 1,
        interlineSpacing: 1.8, // Correctly define the new property
        curvedText: true
      },
      {
        id: crypto.randomUUID(),
        formalName: 'Producto Gratis',
        displayName: 'PRODUCTO GRATIS',
        backgroundColor: '#45B7D1',
        textColor: '#FFFFFF',
        fontSize: 16,
        letterSpacing: 1,
        lineHeight: 1.1,
        distanceFromCenter: 70,
        textLines: ['PRODUCTO', 'GRATIS'],
        fontFamily: 'Bebas Neue',
        isPrize: true,
        probability: 10,
        isActive: true,
        order: 2,
        interlineSpacing: 1.8, // Correctly define the new property
        curvedText: true
      },
      {
        id: crypto.randomUUID(),
        formalName: 'Sin Premio',
        displayName: 'SIGUE INTENTANDO',
        backgroundColor: '#95A5A6',
        textColor: '#FFFFFF',
        fontSize: 14,
        letterSpacing: 1,
        lineHeight: 1.1,
        distanceFromCenter: 70,
        textLines: ['SIGUE', 'INTENTANDO'],
        fontFamily: 'Bebas Neue',
        isPrize: false,
        probability: 0, // Se calcula automáticamente
        isActive: true,
        order: 3,
        interlineSpacing: 1.8, // Correctly define the new property
        curvedText: true
      }
    ];

    setConfig(prev => ({
      ...prev,
      sectors: exampleSectors,
      updatedAt: new Date()
    }));
  }, []);

  // Obtener sector seleccionado
  const selectedSector = useMemo(() => {
    return selectedSectorId ? config.sectors.find(s => s.id === selectedSectorId) : null;
  }, [selectedSectorId, config.sectors]);

  const validateConfig = useCallback(() => {
    const errors: string[] = [];

    const prizesProbabilitySum = config.sectors.filter(s => s.isPrize).reduce((sum, prize) => sum + prize.probability, 0);
    if (prizesProbabilitySum > 100) {
      errors.push('La suma de probabilidades de premios excede el 100%');
    }

    if (config.sectors.length === 0) {
      errors.push('Debe haber al menos un sector activo');
    }

    if (prizesProbabilitySum === 100 && config.sectors.some(s => !s.isPrize)) {
      errors.push('Con 100% de premios, no pueden existir sectores de "no premio"');
    }

    return errors;
  }, [config.sectors]);

  // Llamar a validateConfig antes de guardar
  const saveConfig = useCallback(() => {
    const errors = validateConfig();
    if (errors.length > 0) {
      console.error('Errores en la configuración:', errors);
      return;
    }

    // Guardar configuración válida
    console.log('Configuración válida, guardando...');
  }, [validateConfig]);

  return {
    config,
    setConfig,
    selectedSectorId,
    setSelectedSectorId,
    selectedSector,
    isConfigMode,
    setIsConfigMode,
    
    // Operaciones con sectores
    addSector,
    updateSector,
    removeSector,
    duplicateSector,
    reorderSectors,
    moveSector,
    
    // Copiar/Pegar estilo
    copyStyle,
    pasteStyle,
    copiedStyle,
    
    // Probabilidades
    probabilityDistribution,
    autoDistributeProbabilities,
    
    // Utilidades
    createExampleSectors
  };
};
