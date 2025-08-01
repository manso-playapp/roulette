import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BaseGame, User, Play, Participant } from '../types';
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
