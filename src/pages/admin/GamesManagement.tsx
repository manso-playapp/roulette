import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRouletteManager } from '../../hooks/useFirestore';
import { RouletteConfig } from '../../types/roulette';

interface Game {
  id: string;
  name: string;
  type: 'roulette' | 'trivia' | 'scratch';
  description: string;
  status: 'active' | 'draft' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  totalPlayers: number;
  totalPlays: number;
  conversionRate: number;
  owner: string;
  settings: any;
}

const GamesManagement: React.FC = () => {
  const { user } = useAuth();
  const { 
    roulettes, 
    loading: roulettesLoading, 
    error: roulettesError,
    deleteRoulette,
    duplicateRoulette
  } = useRouletteManager(user?.uid);
  
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [filterType, setFilterType] = useState<'all' | 'roulette' | 'trivia' | 'scratch'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // Convertir ruletas reales a formato Game para mostrar en la lista
    const convertRoulettesToGames = (): Game[] => {
      const gamesFromRoulettes: Game[] = roulettes.map(roulette => ({
        id: roulette.id!,
        name: roulette.name,
        type: 'roulette' as const,
        description: roulette.description || 'Ruleta personalizada',
        status: roulette.isActive ? 'active' : 'draft',
        createdAt: roulette.createdAt,
        updatedAt: roulette.updatedAt,
        totalPlayers: Math.floor(Math.random() * 100), // Placeholder - implementar después
        totalPlays: Math.floor(Math.random() * 500), // Placeholder - implementar después
        conversionRate: Math.floor(Math.random() * 20) + 5, // Placeholder - implementar después
        owner: roulette.createdBy,
        settings: roulette,
      }));

      // Agregar algunos juegos de ejemplo adicionales para mostrar variedad
      const exampleGames: Game[] = [];
      if (gamesFromRoulettes.length < 3) {
        const examples = [
          { name: 'Trivia de Tecnología', type: 'trivia' as const, description: 'Preguntas sobre tecnología y startups' },
          { name: 'Raspadita Digital', type: 'scratch' as const, description: 'Juego de rascar virtual' },
        ];

        examples.forEach((example, index) => {
          exampleGames.push({
            id: `example-${index}`,
            name: example.name,
            type: example.type,
            description: example.description,
            status: 'draft',
            createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            totalPlayers: Math.floor(Math.random() * 50) + 10,
            totalPlays: Math.floor(Math.random() * 200) + 50,
            conversionRate: Math.floor(Math.random() * 15) + 8,
            owner: user?.uid || 'unknown',
            settings: {},
          });
        });
      }

      return [...gamesFromRoulettes, ...exampleGames]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    };

    setLoading(roulettesLoading);
    
    if (!roulettesLoading) {
      const allGames = convertRoulettesToGames();
      setGames(allGames);
      setFilteredGames(allGames);
    }
  }, [roulettes, roulettesLoading, user]);

  useEffect(() => {
    let filtered = games;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(game => game.status === filterStatus);
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(game => game.type === filterType);
    }

    setFilteredGames(filtered);
  }, [games, searchTerm, filterStatus, filterType]);

  // Manejar duplicación de ruleta
  const handleDuplicateRoulette = async (gameId: string, gameName: string) => {
    try {
      setActionLoading(gameId);
      await duplicateRoulette(gameId, `${gameName} (Copia)`);
      // Los datos se actualizarán automáticamente via el hook useRouletteManager
    } catch (error) {
      console.error('Error duplicando ruleta:', error);
      alert('Error al duplicar la ruleta');
    } finally {
      setActionLoading(null);
    }
  };

  // Manejar eliminación de ruleta
  const handleDeleteRoulette = async (gameId: string, gameName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${gameName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setActionLoading(gameId);
      await deleteRoulette(gameId);
      // Los datos se actualizarán automáticamente via el hook useRouletteManager
    } catch (error) {
      console.error('Error eliminando ruleta:', error);
      alert('Error al eliminar la ruleta');
    } finally {
      setActionLoading(null);
    }
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case 'roulette': return '🎰';
      case 'trivia': return '🧠';
      case 'scratch': return '🎫';
      default: return '🎮';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'draft': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'paused': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'draft': return 'Borrador';
      case 'paused': return 'Pausado';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin">🎮</div>
            <div className="text-white text-xl">Cargando juegos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">{/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 font-display">🎮 Gestión de Juegos</h1>
            <p className="text-gray-300 font-body">Administra todos tus juegos interactivos</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="bg-purple-600 text-white px-4 py-2 rounded-lg border border-purple-500 appearance-none cursor-pointer hover:bg-purple-700 transition-colors">
                <option value="">🎮 Crear Juego</option>
              </select>
              <div className="absolute inset-0 bg-transparent">
                <Link
                  to="/admin/games/roulette/new"
                  className="block w-full h-full"
                ></Link>
              </div>
            </div>
            
            <Link
              to="/admin/games/roulette/new"
              onClick={() => console.log('🔗 Navegando a: /admin/games/roulette/new')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <span>🎰</span>
              <span>Nueva Ruleta</span>
            </Link>
            
            <Link
              to="/demo/config"
              className="bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>Demo Config</span>
            </Link>
            
            <Link
              to="/admin/dashboard"
              className="bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Estado */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="draft">Borrador</option>
                <option value="paused">Pausado</option>
              </select>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="roulette">Ruleta</option>
                <option value="trivia">Trivia</option>
                <option value="scratch">Raspadita</option>
              </select>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-display">{games.length}</div>
              <div className="text-gray-300 text-sm font-body">Total Juegos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 font-display">{games.filter(g => g.status === 'active').length}</div>
              <div className="text-gray-300 text-sm font-body">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 font-display">{games.filter(g => g.status === 'draft').length}</div>
              <div className="text-gray-300 text-sm font-body">Borradores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 font-display">
                {games.reduce((acc, g) => acc + g.totalPlayers, 0).toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm font-body">Total Jugadores</div>
            </div>
          </div>
        </div>

        {/* Lista de juegos */}
        {filteredGames.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
            <div className="text-6xl mb-6">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-4 font-display">
              {games.length === 0 ? '¡Crea tu primera ruleta!' : 'No se encontraron juegos'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto font-body">
              {games.length === 0 
                ? 'Empieza creando una ruleta personalizada para tus campañas de marketing' 
                : 'Prueba ajustando los filtros o términos de búsqueda'
              }
            </p>
            {games.length === 0 && (
              <Link
                to="/admin/games/roulette/new"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-3"
              >
                <span>🎰</span>
                <span>Crear Mi Primera Ruleta</span>
              </Link>
            )}
            {roulettesError && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">Error: {roulettesError}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <div key={game.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between">
                  
                  {/* Información del Juego */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-3xl">
                      {getGameIcon(game.type)}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">{game.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{game.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(game.status)}`}>
                          {getStatusText(game.status)}
                        </span>
                        <span className="text-gray-400 capitalize">{game.type}</span>
                        <span className="text-gray-400">
                          Actualizado {game.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="hidden md:flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white font-display">{game.totalPlayers.toLocaleString()}</div>
                      <div className="text-gray-300 text-xs font-body">Jugadores</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 font-display">{game.totalPlays.toLocaleString()}</div>
                      <div className="text-gray-300 text-xs font-body">Jugadas</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-display">{game.conversionRate}%</div>
                      <div className="text-gray-300 text-xs font-body">Conversión</div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-3">
                    {game.type === 'roulette' ? (
                      <>
                        <Link
                          to={`/admin/games/roulette/${game.id}`}
                          onClick={() => console.log('🔗 Navegando a: /admin/games/roulette/' + game.id)}
                          className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors text-sm border border-purple-400/30 flex items-center space-x-1"
                        >
                          <span>✏️</span>
                          <span>Editar</span>
                        </Link>
                        
                        <button
                          onClick={() => handleDuplicateRoulette(game.id, game.name)}
                          disabled={actionLoading === game.id}
                          className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm border border-blue-400/30 flex items-center space-x-1 disabled:opacity-50"
                        >
                          {actionLoading === game.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          ) : (
                            <>
                              <span>📋</span>
                              <span>Duplicar</span>
                            </>
                          )}
                        </button>
                        
                        <Link
                          to={`/games/${game.id}/play`}
                          className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm border border-green-400/30 flex items-center space-x-1"
                        >
                          <span>🎮</span>
                          <span>Jugar</span>
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteRoulette(game.id, game.name)}
                          disabled={actionLoading === game.id}
                          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm border border-red-400/30 disabled:opacity-50"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/admin/games/${game.id}/analytics`}
                          className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm border border-blue-400/30"
                        >
                          📊 Analytics
                        </Link>
                        
                        <Link
                          to={`/admin/games/${game.id}/edit`}
                          className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors text-sm border border-purple-400/30"
                        >
                          ✏️ Editar
                        </Link>
                        
                        <Link
                          to={`/games/${game.id}/play`}
                          className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm border border-green-400/30"
                        >
                          🎮 Jugar
                        </Link>
                        
                        <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm border border-red-400/30">
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación (placeholder) */}
        {filteredGames.length > 10 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2">
                <button className="text-white hover:text-blue-400 px-3 py-1 rounded">←</button>
                <span className="text-white px-3 py-1 bg-blue-500 rounded">1</span>
                <button className="text-gray-400 hover:text-white px-3 py-1 rounded">2</button>
                <button className="text-gray-400 hover:text-white px-3 py-1 rounded">3</button>
                <button className="text-white hover:text-blue-400 px-3 py-1 rounded">→</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default GamesManagement;
