import React from 'react';
import { useDashboardData, useUserGames } from '../../hooks/useFirestore';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error, refresh } = useDashboardData();
  
  // Solo obtener juegos si el usuario existe y es estable
  const userId = user?.uid;
  const { games: userGames, loading: gamesLoading } = useUserGames(userId || null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
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
    <div className="container-padding bg-pattern">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-white text-shadow-strong">
          ✨ Dashboard Interactivo
        </h1>
        <button 
          onClick={refresh}
          className="btn-glass px-6 py-3 text-lg hover-lift"
        >
          <span className="text-xl">🔄</span>
          <span>Actualizar</span>
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card-white p-6 hover-lift animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Total Juegos</p>
              <p className="text-4xl font-bold text-gradient">{data.totalGames}</p>
            </div>
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🎮</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="status-indicator status-active"></span>
            <span className="text-sm text-gray-500">Sistema activo</span>
          </div>
        </div>

        <div className="glass-card-white p-6 hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Usuarios Activos</p>
              <p className="text-4xl font-bold text-gradient">{data.totalUsers}</p>
            </div>
            <div className="w-16 h-16 gradient-success rounded-2xl flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="status-indicator status-active"></span>
            <span className="text-sm text-gray-500">En línea</span>
          </div>
        </div>

        <div className="glass-card-white p-6 hover-lift animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Premios Disponibles</p>
              <p className="text-4xl font-bold text-gradient">{data.totalPrizes}</p>
            </div>
            <div className="w-16 h-16 gradient-warning rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="status-indicator status-active"></span>
            <span className="text-sm text-gray-500">Configurados</span>
          </div>
        </div>

        <div className="glass-card-white p-6 hover-lift animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Jugadas Totales</p>
              <p className="text-4xl font-bold text-gradient">{data.totalPlays}</p>
            </div>
            <div className="w-16 h-16 gradient-info rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="status-indicator status-pending"></span>
            <span className="text-sm text-gray-500">Listo para jugar</span>
          </div>
        </div>
      </div>

      {/* Juegos recientes */}
      <div className="glass-card-white p-8 mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <span className="text-3xl">🎰</span>
          <span>Juegos Recientes</span>
        </h2>
        
        {data.recentGames.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📭</span>
            <p>No hay juegos creados aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentGames.map((game: any) => (
              <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {game.type === 'roulette' ? '🎰' : 
                     game.type === 'trivia' ? '🧠' : 
                     game.type === 'scratch' ? '🎫' : '�'}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{game.name}</h3>
                    <p className="text-sm text-gray-500">
                      {game.type} • {game.totalPlays || 0} jugadas • {game.totalPrizes || 0} premios
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    game.status === 'active' ? 'bg-green-100 text-green-800' : 
                    game.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {game.status === 'active' ? 'Activo' : 
                     game.status === 'draft' ? 'Borrador' : 
                     'Pausado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usuarios recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <span className="text-2xl">👤</span>
          <span>Usuarios Recientes</span>
        </h2>
        
        {data.recentUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">👻</span>
            <p>No hay usuarios registrados aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.displayName || user.email}</h3>
                    <p className="text-sm text-gray-500">
                      {user.email} • {user.totalGamesPlayed || 0} juegos jugados
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Hoy'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mis juegos (si hay usuario logueado) */}
      {user && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span>Mis Juegos</span>
          </h2>
          
          {gamesLoading ? (
            <div className="text-center py-4">
              <span className="text-2xl animate-spin">⚡</span>
            </div>
          ) : userGames.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block mb-2">🚀</span>
              <p>¡Crea tu primer juego interactivo!</p>
              <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Crear Juego
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userGames.map((game: any) => (
                <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{game.name}</h3>
                    <span className="text-xl">
                      {game.type === 'roulette' ? '🎰' : 
                       game.type === 'trivia' ? '🧠' : 
                       game.type === 'scratch' ? '🎫' : '🎮'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.status === 'active' ? 'bg-green-100 text-green-800' : 
                      game.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {game.status === 'active' ? 'Activo' : 
                       game.status === 'draft' ? 'Borrador' : 
                       'Pausado'}
                    </span>
                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
