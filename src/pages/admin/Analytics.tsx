import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface AnalyticsData {
  overview: {
    totalGames: number;
    totalPlayers: number;
    totalPrizes: number;
    conversionRate: number;
    avgSessionTime: string;
    bounceRate: number;
  };
  recentMetrics: {
    playersToday: number;
    gamesPlayedToday: number;
    prizesWonToday: number;
    revenueToday: number;
  };
  topGames: Array<{
    id: string;
    name: string;
    type: string;
    players: number;
    plays: number;
    conversionRate: number;
  }>;
  playerActivity: Array<{
    hour: string;
    players: number;
    games: number;
  }>;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalGames: 0,
      totalPlayers: 0,
      totalPrizes: 0,
      conversionRate: 0,
      avgSessionTime: '0:00',
      bounceRate: 0,
    },
    recentMetrics: {
      playersToday: 0,
      gamesPlayedToday: 0,
      prizesWonToday: 0,
      revenueToday: 0,
    },
    topGames: [],
    playerActivity: [],
  });

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos analíticos
    const loadAnalyticsData = () => {
      setLoading(true);
      
      // Datos simulados
      setTimeout(() => {
        setAnalyticsData({
          overview: {
            totalGames: 47,
            totalPlayers: 1284,
            totalPrizes: 156,
            conversionRate: 12.1,
            avgSessionTime: '4:32',
            bounceRate: 23.5,
          },
          recentMetrics: {
            playersToday: 89,
            gamesPlayedToday: 234,
            prizesWonToday: 28,
            revenueToday: 1450,
          },
          topGames: [
            {
              id: '1',
              name: 'Ruleta Premium',
              type: 'roulette',
              players: 456,
              plays: 1234,
              conversionRate: 15.2,
            },
            {
              id: '2',
              name: 'Trivia Deportes',
              type: 'trivia',
              players: 298,
              plays: 892,
              conversionRate: 11.8,
            },
            {
              id: '3',
              name: 'Raspadita Virtual',
              type: 'scratch',
              players: 187,
              plays: 543,
              conversionRate: 8.3,
            },
          ],
          playerActivity: [
            { hour: '00:00', players: 12, games: 23 },
            { hour: '06:00', players: 34, games: 67 },
            { hour: '12:00', players: 89, games: 156 },
            { hour: '18:00', players: 134, games: 234 },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    loadAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">📊</div>
            <div className="text-white text-xl">Cargando Analytics...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">{/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 font-display">📊 Analytics Avanzados</h1>
            <p className="text-gray-300 font-body">Métricas detalladas y insights de tu plataforma</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-white/10 rounded-lg p-1">
              {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-white text-gray-900'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {range === '24h' ? 'Hoy' : range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
                </button>
              ))}
            </div>
            
            <Link
              to="/admin/dashboard"
              className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-2xl font-bold text-white font-display">{analyticsData.overview.totalGames}</div>
            <div className="text-gray-300 text-sm font-body">Total Juegos</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white font-display">{analyticsData.overview.totalPlayers.toLocaleString()}</div>
            <div className="text-gray-300 text-sm font-body">Total Jugadores</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white font-display">{analyticsData.overview.totalPrizes}</div>
            <div className="text-gray-300 text-sm font-body">Premios Entregados</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-2xl font-bold text-white font-display">{analyticsData.overview.conversionRate}%</div>
            <div className="text-gray-300 text-sm font-body">Conversión</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-white font-display">{analyticsData.overview.avgSessionTime}</div>
            <div className="text-gray-300 text-sm font-body">Tiempo Promedio</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white font-display">{analyticsData.overview.bounceRate}%</div>
            <div className="text-gray-300 text-sm">Tasa Rebote</div>
          </div>
        </div>

        {/* Métricas de Hoy */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">🔥 Actividad de Hoy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 font-display">{analyticsData.recentMetrics.playersToday}</div>
              <div className="text-gray-300 text-sm font-body">Jugadores Activos</div>
              <div className="text-green-400 text-xs mt-1 font-body">+12% vs ayer</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 font-display">{analyticsData.recentMetrics.gamesPlayedToday}</div>
              <div className="text-gray-300 text-sm font-body">Juegos Jugados</div>
              <div className="text-green-400 text-xs mt-1 font-body">+8% vs ayer</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 font-display">{analyticsData.recentMetrics.prizesWonToday}</div>
              <div className="text-gray-300 text-sm font-body">Premios Ganados</div>
              <div className="text-green-400 text-xs mt-1 font-body">+15% vs ayer</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 font-display">${analyticsData.recentMetrics.revenueToday.toLocaleString()}</div>
              <div className="text-gray-300 text-sm font-body">Ingresos Estimados</div>
              <div className="text-green-400 text-xs mt-1 font-body">+22% vs ayer</div>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Juegos */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 font-display">🏆 Top Juegos</h2>
            
            <div className="space-y-4">
              {analyticsData.topGames.map((game, index) => (
                <div key={game.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold font-display">{game.name}</h3>
                        <p className="text-gray-400 text-sm capitalize">{game.type}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-semibold">{game.players} jugadores</div>
                      <div className="text-gray-400 text-sm">{game.plays} jugadas</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-300">
                      Conversión: <span className="text-green-400 font-semibold">{game.conversionRate}%</span>
                    </div>
                    
                    <Link
                      to={`/admin/games/${game.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad por Horas */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 font-display">📈 Actividad por Horas</h2>
            
            <div className="space-y-4">
              {analyticsData.playerActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-gray-300 font-medium">{activity.hour}</div>
                  
                  <div className="flex-1 mx-4">
                    <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(activity.players / 140) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-semibold">{activity.players}</div>
                    <div className="text-gray-400 text-xs">{activity.games} juegos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exportar Datos */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 font-display">📋 Exportar Reportes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 hover:bg-blue-500/30 transition-colors text-white">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Reporte Completo</div>
              <div className="text-sm text-gray-300">Excel con todas las métricas</div>
            </button>

            <button className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 hover:bg-green-500/30 transition-colors text-white">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold">Analytics CSV</div>
              <div className="text-sm text-gray-300">Datos para análisis externo</div>
            </button>

            <button className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4 hover:bg-purple-500/30 transition-colors text-white">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold">Resumen PDF</div>
              <div className="text-sm text-gray-300">Reporte ejecutivo</div>
            </button>
          </div>
        </div>
    </div>
  );
};

export default Analytics;
