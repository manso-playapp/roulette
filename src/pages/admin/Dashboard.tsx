import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardData, useUserGames } from '../../hooks/useFirestore';
import { useAuth } from '../../hooks/useAuth';
import { VersionBadge, VersionInfo, ReleaseNotes } from '../../components/VersionInfo';

interface DashboardStats {
  totalGames: number;
  totalPlayers: number;
  totalPrizes: number;
  activeGames: number;
  connectionsToday: number;
  prizesDelivered: number;
  conversionRate: number;
  topGame: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error, refresh } = useDashboardData();
  const userId = user?.uid;
  const { games: userGames, loading: gamesLoading } = useUserGames(userId || null);
  
  // Estados para métricas en tiempo real
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalPlayers: 0,
    totalPrizes: 0,
    activeGames: 0,
    connectionsToday: 24,
    prizesDelivered: 156,
    conversionRate: 73.5,
    topGame: 'Ruleta de Verano'
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'prize', user: 'María García', game: 'Ruleta Premium', time: 'Hace 2 min', prize: 'Descuento 20%' },
    { id: 2, type: 'connection', user: 'Carlos López', game: 'Trivia Tech', time: 'Hace 5 min', prize: null },
    { id: 3, type: 'prize', user: 'Ana Rodríguez', game: 'Raspadita Digital', time: 'Hace 8 min', prize: 'Producto Gratis' },
    { id: 4, type: 'connection', user: 'Pedro Martín', game: 'Ruleta Premium', time: 'Hace 12 min', prize: null },
    { id: 5, type: 'prize', user: 'Sofía Torres', game: 'Ruleta de Verano', time: 'Hace 15 min', prize: 'Envío Gratis' }
  ]);

  // Simular actualización de estadísticas
  useEffect(() => {
    if (userGames) {
      setStats(prev => ({
        ...prev,
        totalGames: userGames.length,
        activeGames: userGames.filter(game => game.isActive).length
      }));
    }
  }, [userGames]);

  if (loading || gamesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-gray-600">Cargando dashboard administrativo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">❌</span>
          <div>
            <h3 className="text-red-800 font-semibold">Error cargando datos</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button 
          onClick={refresh}
          className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">
            📊 Dashboard Administrativo
          </h1>
          <p className="text-gray-300 font-body">
            Gestiona tus juegos, analiza métricas y controla toda la plataforma
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/games/new"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nuevo Juego</span>
          </Link>
          
          <button className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-200">
            🔔
          </button>
          
          <button 
            onClick={refresh}
            className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            🔄
          </button>
        </div>
      </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-body">Total Juegos</p>
                <p className="text-3xl font-bold text-white font-display">{stats.totalGames}</p>
              </div>
              <div className="text-4xl">🎮</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-green-400 text-sm font-body">↗️ {stats.activeGames} activos</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-body">Conexiones Hoy</p>
                <p className="text-3xl font-bold text-white font-display">{stats.connectionsToday}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-blue-400 text-sm font-body">📈 +15% vs ayer</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-body">Premios Entregados</p>
                <p className="text-3xl font-bold text-white font-display">{stats.prizesDelivered}</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-yellow-400 text-sm font-body">🎁 Última hora: 12</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-body">Conversión</p>
                <p className="text-3xl font-bold text-white font-display">{stats.conversionRate}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-green-400 text-sm">✅ Excelente</span>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mis Juegos */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-display">🎮 Mis Juegos</h2>
              <Link
                to="/admin/games"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Ver todos →
              </Link>
            </div>

            {userGames && userGames.length > 0 ? (
              <div className="space-y-4">
                {userGames.slice(0, 3).map((game, index) => (
                  <div key={game.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">
                            {game.type === 'roulette' ? '🎰' : game.type === 'trivia' ? '🧠' : '🎲'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold font-display">{game.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {game.type === 'roulette' ? 'Ruleta' : game.type === 'trivia' ? 'Trivia' : 'Juego'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-white font-medium">24 jugadores</div>
                          <div className={`text-xs ${game.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                            {game.isActive ? '🟢 Activo' : '⚪ Inactivo'}
                          </div>
                        </div>
                        
                        <Link
                          to={`/admin/games/${game.id}/edit`}
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-white font-semibold mb-2 font-display">No tienes juegos aún</h3>
                <p className="text-gray-400 mb-6">Crea tu primer juego para comenzar</p>
                <Link
                  to="/admin/games/new"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Crear Primer Juego
                </Link>
              </div>
            )}
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 font-display">📈 Actividad Reciente</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activity.type === 'prize' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {activity.type === 'prize' ? '🏆' : '👤'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-white text-sm">
                      <strong>{activity.user}</strong>
                      {activity.type === 'prize' ? (
                        <span> ganó <span className="text-yellow-400">{activity.prize}</span></span>
                      ) : (
                        <span> se conectó</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      en {activity.game} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                to="/admin/analytics"
                className="block text-center bg-white/5 text-white py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                Ver Analytics Completos
              </Link>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6 font-display">⚡ Acciones Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/demo/config"
              className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 hover:bg-purple-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">⚙️</div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-purple-200 font-display">
                    Configurador Avanzado
                  </h3>
                  <p className="text-gray-400 text-sm">Personaliza ruletas con vista previa</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 hover:bg-blue-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📊</div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-200 font-display">
                    Analytics Avanzados
                  </h3>
                  <p className="text-gray-400 text-sm">Métricas detalladas y reportes</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 hover:bg-green-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">⚙️</div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-green-200 font-display">
                    Configuración
                  </h3>
                  <p className="text-gray-400 text-sm">Ajustes generales y cuenta</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Información de Versión */}
        <div className="mt-8 flex items-center justify-center">
          <VersionBadge className="bg-white/10 text-white border-white/30" />
        </div>
    </div>
  );
};

export default Dashboard;
