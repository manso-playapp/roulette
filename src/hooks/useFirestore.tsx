import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc, addDoc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BaseGame, User, Play, Participant } from '../types';
import { RouletteConfig } from '../types/roulette';
import { logger } from '../utils/logger';

// Hook para obtener estadísticas del dashboard
export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalGames: 0,
    activeGames: 0,
    totalPlays: 0,
    totalPrizes: 0,
    totalUsers: 0,
    totalParticipants: 0,
    playsToday: 0,
    recentGames: [] as any[],
    recentUsers: [] as any[],
    recentActivity: [] as any[]
  });
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener juegos
      logger.debug('Obteniendo juegos...');
      const gamesSnapshot = await getDocs(collection(db, 'games'));
      const games = gamesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // 2. Obtener usuarios
      logger.debug('Obteniendo usuarios...');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // 3. Obtener premios
      logger.debug('Obteniendo premios...');
      const prizesSnapshot = await getDocs(collection(db, 'prizes'));
      const prizes = prizesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 4. Intentar obtener jugadas (si existen)
      let plays: any[] = [];
      try {
        const playsSnapshot = await getDocs(collection(db, 'plays'));
        plays = playsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        logger.info('Colección de jugadas aún no existe');
      }

      // 5. Intentar obtener participantes (si existen)
      let participants: any[] = [];
      try {
        const participantsSnapshot = await getDocs(collection(db, 'participants'));
        participants = participantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        logger.info('Colección de participantes aún no existe');
      }

      // Calcular estadísticas
      const activeGames = games.filter(game => game.status === 'active').length;
      const totalPlays = games.reduce((sum, game) => sum + (game.totalPlays || 0), 0);
      const totalPrizes = games.reduce((sum, game) => sum + (game.totalPrizes || 0), 0);

      // Simular jugadas de hoy (basado en datos existentes)
      const playsToday = Math.floor(totalPlays * 0.15); // 15% del total

      // Actividad reciente simulada basada en datos reales
      const recentActivity = [
        {
          id: '1',
          type: 'game_created',
          message: `Juego "${games[0]?.name || 'Demo'}" creado`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: '🎮'
        },
        {
          id: '2', 
          type: 'user_registered',
          message: `Usuario "${users[0]?.name || 'Demo'}" registrado`,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: '👤'
        },
        {
          id: '3',
          type: 'prize_configured',
          message: `${prizes.length} premios configurados`,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          icon: '🏆'
        }
      ];

      const dashboardData = {
        totalGames: games.length,
        activeGames,
        totalPlays,
        totalPrizes,
        totalUsers: users.length,
        totalParticipants: participants.length,
        playsToday,
        recentGames: games.slice(0, 3), // Últimos 3 juegos
        recentUsers: users.slice(0, 3), // Últimos 3 usuarios
        recentActivity
      };

      logger.success('Datos del dashboard obtenidos:', dashboardData);
      setData(dashboardData);

    } catch (error) {
      console.error('❌ Error obteniendo datos del dashboard:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboardData
  };
};

// Hook para obtener un juego específico
export const useGame = (gameId: string) => {
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return;

      try {
        setLoading(true);
        const gameDoc = await getDoc(doc(db, 'games', gameId));
        
        if (gameDoc.exists()) {
          setGame({ id: gameDoc.id, ...gameDoc.data() });
        } else {
          setError('Juego no encontrado');
        }
      } catch (error) {
        console.error('Error obteniendo juego:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  return { game, loading, error };
};

// Hook para obtener lista de juegos del usuario
export const useUserGames = (userId: string | null) => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGames = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Por ahora obtener todos los juegos, en el futuro filtrar por userId
        const gamesSnapshot = await getDocs(collection(db, 'games'));
        const userGames = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setGames(userGames);
      } catch (error) {
        logger.error('Error obteniendo juegos del usuario:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [userId]);

  return { games, loading, error };
};

// Hook para gestionar ruletas en Firebase
export const useRouletteManager = (userId?: string) => {
  const [roulettes, setRoulettes] = useState<RouletteConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las ruletas del usuario
  const fetchRoulettes = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Si es usuario demo, crear datos de ejemplo
      if (userId.startsWith('demo-user-')) {
        const demoRoulettes: RouletteConfig[] = [
          {
            id: 'demo-roulette-1',
            name: 'Ruleta de Premios Demo',
            description: 'Una ruleta de ejemplo para probar funcionalidades',
            clientName: 'Cliente Demo',
            clientEmail: 'cliente@demo.com',
            clientInstagram: '@cliente_demo',
            verificationEmail: 'verificacion@demo.com',
            sectors: [
              {
                id: '1',
                formalName: 'Premio Mayor',
                displayName: 'PREMIO MAYOR',
                backgroundColor: '#FF6B6B',
                textColor: '#FFFFFF',
                probability: 10,
                isPrize: true,
                order: 0,
                minAngle: 0,
                maxAngle: 36
              },
              {
                id: '2',
                formalName: 'Descuento 50%',
                displayName: '50% OFF',
                backgroundColor: '#4ECDC4',
                textColor: '#FFFFFF',
                probability: 20,
                isPrize: true,
                order: 1,
                minAngle: 36,
                maxAngle: 108
              },
              {
                id: '3',
                formalName: 'Sigue Intentando',
                displayName: 'SIGUE INTENTANDO',
                backgroundColor: '#45B7D1',
                textColor: '#FFFFFF',
                probability: 70,
                isPrize: false,
                order: 2,
                minAngle: 108,
                maxAngle: 360
              }
            ],
            isActive: true,
            isDemoMode: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            createdBy: userId,
            instagramAccount: '@cliente_demo',
            welcomeMessage: '¡Participa y gana increíbles premios!'
          }
        ];
        
        setRoulettes(demoRoulettes);
        logger.info('Cargadas ruletas demo');
        return;
      }

      // Código normal para usuarios reales
      const roulettesQuery = query(
        collection(db, 'roulettes'),
        where('createdBy', '==', userId)
        // Removemos orderBy temporalmente para evitar problemas de índice
        // orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(roulettesQuery);
      const userRoulettes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as RouletteConfig[];

      // Ordenamos en el cliente en lugar de en Firestore
      userRoulettes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setRoulettes(userRoulettes);
      logger.info(`Cargadas ${userRoulettes.length} ruletas del usuario`);
    } catch (error) {
      logger.error('Error obteniendo ruletas:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar ruletas');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva ruleta
  const createRoulette = async (rouletteData: Omit<RouletteConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('Usuario no autenticado');

    try {
      setLoading(true);
      const now = new Date();
      
      const newRoulette = {
        ...rouletteData,
        createdBy: userId,
        createdAt: now,
        updatedAt: now
      };

      // Si es usuario demo, simular creación
      if (userId.startsWith('demo-user-')) {
        const demoRoulette: RouletteConfig = {
          ...newRoulette,
          id: `demo-roulette-${Date.now()}`
        };
        
        setRoulettes(prev => [demoRoulette, ...prev]);
        logger.info('Ruleta demo creada exitosamente');
        return demoRoulette.id!;
      }

      // Código normal para usuarios reales
      const docRef = await addDoc(collection(db, 'roulettes'), newRoulette);
      await fetchRoulettes(); // Recargar la lista
      logger.info('Ruleta creada exitosamente:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      logger.error('Error creando ruleta:', error);
      setError(error instanceof Error ? error.message : 'Error al crear ruleta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ruleta existente
  const updateRoulette = async (rouletteId: string, updates: Partial<RouletteConfig>) => {
    try {
      setLoading(true);
      
      // Si es usuario demo, actualizar en memoria
      if (userId?.startsWith('demo-user-')) {
        setRoulettes(prev => 
          prev.map(r => 
            r.id === rouletteId 
              ? { ...r, ...updates, updatedAt: new Date() }
              : r
          )
        );
        logger.info('Ruleta demo actualizada exitosamente:', rouletteId);
        return;
      }

      // Código normal para usuarios reales
      const rouletteRef = doc(db, 'roulettes', rouletteId);
      await updateDoc(rouletteRef, {
        ...updates,
        updatedAt: new Date()
      });

      await fetchRoulettes(); // Recargar la lista
      logger.info('Ruleta actualizada exitosamente:', rouletteId);
    } catch (error) {
      logger.error('Error actualizando ruleta:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar ruleta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ruleta
  const deleteRoulette = async (rouletteId: string) => {
    try {
      setLoading(true);
      
      const rouletteRef = doc(db, 'roulettes', rouletteId);
      await deleteDoc(rouletteRef);

      await fetchRoulettes(); // Recargar la lista
      logger.info('Ruleta eliminada exitosamente:', rouletteId);
    } catch (error) {
      logger.error('Error eliminando ruleta:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar ruleta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener una ruleta específica
  const getRoulette = async (rouletteId: string): Promise<RouletteConfig | null> => {
    try {
      const rouletteRef = doc(db, 'roulettes', rouletteId);
      const rouletteDoc = await getDoc(rouletteRef);
      
      if (rouletteDoc.exists()) {
        const data = rouletteDoc.data();
        return {
          id: rouletteDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as RouletteConfig;
      }
      
      return null;
    } catch (error) {
      logger.error('Error obteniendo ruleta:', error);
      throw error;
    }
  };

  // Duplicar ruleta
  const duplicateRoulette = async (rouletteId: string, newName?: string) => {
    try {
      const originalRoulette = await getRoulette(rouletteId);
      if (!originalRoulette) throw new Error('Ruleta no encontrada');

      const duplicatedRoulette = {
        ...originalRoulette,
        name: newName || `${originalRoulette.name} (Copia)`,
        isActive: false, // Las copias inician inactivas
      };

      delete (duplicatedRoulette as any).id; // Remover el ID para que se genere uno nuevo
      
      return await createRoulette(duplicatedRoulette);
    } catch (error) {
      logger.error('Error duplicando ruleta:', error);
      throw error;
    }
  };

  // Cargar ruletas al montar el componente
  useEffect(() => {
    if (userId) {
      fetchRoulettes();
    }
  }, [userId]);

  return {
    roulettes,
    loading,
    error,
    fetchRoulettes,
    createRoulette,
    updateRoulette,
    deleteRoulette,
    getRoulette,
    duplicateRoulette
  };
};
