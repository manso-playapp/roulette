import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { PlatformConfig, HeroCarouselImage } from '../types';

// Importar función de test
import { testFirestore } from '../utils/testFirestore';

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
  (window as any).testFirestore = testFirestore;
}

// Hook para manejar la configuración de la plataforma
export const usePlatformConfig = () => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Configuración por defecto
  const defaultConfig: PlatformConfig = {
    id: 'default',
    branding: {
      primaryColor: '#9333ea', // purple-600
      secondaryColor: '#0ea5e9', // sky-500
      accentColor: '#f59e0b',   // amber-500
    },
    heroCarousel: {
      enabled: true,
      autoRotate: true,
      rotationInterval: 4,
      images: [
        {
          id: '1',
          title: 'Ruleta Promocional',
          icon: '🎰',
          imageUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          mediaType: 'image' as const,
          overlay: 'bg-gradient-to-br from-purple-900/50 to-blue-900/50',
          isActive: true,
          order: 1
        },
        {
          id: '2',
          title: 'Trivia Interactiva',
          icon: '🧠',
          imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          mediaType: 'image' as const,
          overlay: 'bg-gradient-to-br from-green-900/50 to-teal-900/50',
          isActive: true,
          order: 2
        },
        {
          id: '3',
          title: 'Raspaditas Digitales',
          icon: '🎫',
          imageUrl: 'https://images.unsplash.com/photo-1533740566848-5f7d7e2e0bf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          mediaType: 'image' as const,
          overlay: 'bg-gradient-to-br from-orange-900/50 to-red-900/50',
          isActive: true,
          order: 3
        },
        {
          id: '4',
          title: 'Wheel of Fortune',
          icon: '🎡',
          imageUrl: 'https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          mediaType: 'image' as const,
          overlay: 'bg-gradient-to-br from-pink-900/50 to-purple-900/50',
          isActive: true,
          order: 4
        },
        {
          id: '5',
          title: 'Juego de Memoria',
          icon: '🃏',
          imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          mediaType: 'image' as const,
          overlay: 'bg-gradient-to-br from-indigo-900/50 to-blue-900/50',
          isActive: true,
          order: 5
        },
        {
          id: '6',
          title: 'Bingo Digital',
          icon: '🎱',
          imageUrl: 'https://images.unsplash.com/photo-1551019164-1adaf19d3b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
          mediaType: 'image' as const,
          overlay: 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50',
          isActive: true,
          order: 6
        }
      ]
    },
    seo: {
      title: 'PlayApp - Plataforma de Juegos Interactivos',
      description: 'Crea experiencias gamificadas que aumentan el engagement y potencian tus campañas de marketing.',
      keywords: ['juegos interactivos', 'gamificación', 'marketing', 'ruletas', 'trivias'],
    }
  };

  useEffect(() => {
    // Cargar configuración desde Firestore
    const loadConfig = async () => {
      try {
        console.log('🔄 Cargando configuración de plataforma...');
        const docRef = doc(db, 'platformConfig', 'main');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const savedConfig = docSnap.data() as PlatformConfig;
          console.log('✅ Configuración cargada desde Firestore:', savedConfig);
          setConfig(savedConfig);
        } else {
          console.log('📝 No hay configuración guardada, usando configuración por defecto');
          // Guardar la configuración por defecto en Firestore
          await setDoc(docRef, defaultConfig);
          setConfig(defaultConfig);
        }
      } catch (error) {
        console.error('❌ Error cargando configuración de plataforma:', error);
        setConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const saveConfigToFirestore = async (updatedConfig: PlatformConfig) => {
    try {
      console.log('💾 Guardando configuración en Firestore...');
      console.log('📊 Configuración a guardar:', updatedConfig);
      console.log('🔧 Database instance:', db);
      
      const docRef = doc(db, 'platformConfig', 'main');
      console.log('📄 Referencia del documento:', docRef.path);
      
      await setDoc(docRef, updatedConfig);
      console.log('✅ Configuración guardada exitosamente en Firestore');
      
      // Verificar que se guardó correctamente
      const savedDoc = await getDoc(docRef);
      if (savedDoc.exists()) {
        console.log('✅ Verificación: Documento existe en Firestore');
        console.log('📋 Datos guardados:', savedDoc.data());
      } else {
        console.error('❌ Verificación falló: Documento no encontrado después de guardar');
      }
      
    } catch (error: any) {
      console.error('❌ Error guardando configuración:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  };

  const updateHeroImage = async (imageId: string, updates: Partial<HeroCarouselImage>) => {
    if (!config) return;

    const updatedImages = config.heroCarousel.images.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    );

    const updatedConfig = {
      ...config,
      heroCarousel: {
        ...config.heroCarousel,
        images: updatedImages
      }
    };

    setConfig(updatedConfig);
    await saveConfigToFirestore(updatedConfig);
  };

  const addHeroImage = async (newImage: Omit<HeroCarouselImage, 'id'>) => {
    if (!config) return;

    const imageWithId: HeroCarouselImage = {
      ...newImage,
      id: Date.now().toString()
    };

    const updatedConfig = {
      ...config,
      heroCarousel: {
        ...config.heroCarousel,
        images: [...config.heroCarousel.images, imageWithId]
      }
    };

    setConfig(updatedConfig);
    await saveConfigToFirestore(updatedConfig);
  };

  const removeHeroImage = async (imageId: string) => {
    if (!config) return;

    const updatedImages = config.heroCarousel.images.filter(img => img.id !== imageId);
    
    const updatedConfig = {
      ...config,
      heroCarousel: {
        ...config.heroCarousel,
        images: updatedImages
      }
    };

    setConfig(updatedConfig);
    await saveConfigToFirestore(updatedConfig);
  };

  return {
    config,
    loading,
    updateHeroImage,
    addHeroImage,
    removeHeroImage,
    // Helpers
    activeHeroImages: config?.heroCarousel.images.filter(img => img.isActive).sort((a, b) => a.order - b.order) ?? [],
  };
};
