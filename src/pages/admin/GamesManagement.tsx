import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRouletteManager } from '../../hooks/useFirestore';

interface GameInstance {
  id: string;
  name: string;
  type: 'roulette' | 'trivia' | 'scratch';
  description: string;
  status: 'active' | 'draft' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  url: string;
  qrCode?: string;
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
  
  const [gameInstances, setGameInstances] = useState<GameInstance[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<GameInstance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [filterType, setFilterType] = useState<'all' | 'roulette' | 'trivia' | 'scratch'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // Convertir ruletas reales a instancias de juego
    const convertRoulettesToInstances = (): GameInstance[] => {
      return roulettes.map(roulette => ({
        id: roulette.id!,
        name: roulette.name,
        type: 'roulette' as const,
        description: roulette.description || 'Ruleta personalizada',
        status: roulette.isActive ? 'active' : 'draft',
        createdAt: roulette.createdAt,
        updatedAt: roulette.updatedAt,
        isPublic: roulette.isActive,
        url: roulette.isActive ? `${window.location.origin}/game/${roulette.id}` : '',
        settings: roulette,
      })).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    };

    if (!roulettesLoading) {
      const instances = convertRoulettesToInstances();
      setGameInstances(instances);
      setFilteredInstances(instances);
    }
  }, [roulettes, roulettesLoading]);

  useEffect(() => {
    let filtered = gameInstances;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(instance =>
        instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instance.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(instance => instance.status === filterStatus);
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(instance => instance.type === filterType);
    }

    setFilteredInstances(filtered);
  }, [gameInstances, searchTerm, filterStatus, filterType]);

  // Generar QR Code (simulado)
  const generateQRCode = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  // Copiar URL al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('¡URL copiada al portapapeles!');
    } catch (err) {
      console.error('Error copiando al portapapeles:', err);
      // Fallback para navegadores que no soporten clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡URL copiada al portapapeles!');
    }
  };

  // Manejar duplicación
  const handleDuplicate = async (instanceId: string, instanceName: string) => {
    if (!window.confirm(`¿Crear una copia de "${instanceName}"?`)) return;
    
    try {
      setActionLoading(instanceId);
      await duplicateRoulette(instanceId, `${instanceName} (Copia)`);
    } catch (error) {
      console.error('Error duplicando:', error);
      alert('Error al duplicar la instancia');
    } finally {
      setActionLoading(null);
    }
  };

  // Manejar eliminación
  const handleDelete = async (instanceId: string, instanceName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${instanceName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setActionLoading(instanceId);
      await deleteRoulette(instanceId);
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar la instancia');
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
      case 'active': return 'Publicado';
      case 'draft': return 'Borrador';
      case 'paused': return 'Pausado';
      default: return 'Desconocido';
    }
  };

  if (roulettesLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin">🎰</div>
            <div className="text-white text-xl">Cargando instancias de juegos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">🎰 Mis Juegos</h1>
          <p className="text-gray-300 font-body">Gestiona las instancias activas de tus juegos</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/studio"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <span>🏭</span>
            <span>STUDIO</span>
          </Link>
          
          <Link
            to="/admin/games/roulette/new"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nueva Instancia</span>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Búsqueda */}
          <div>
            <input
              type="text"
              placeholder="Buscar instancias..."
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
              <option value="active">Publicado</option>
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
              <option value="roulette">Ruletas</option>
              <option value="trivia">Trivias</option>
              <option value="scratch">Raspaditas</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-display">{gameInstances.length}</div>
            <div className="text-gray-300 text-sm font-body">Total Instancias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 font-display">{gameInstances.filter(g => g.status === 'active').length}</div>
            <div className="text-gray-300 text-sm font-body">Publicadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 font-display">{gameInstances.filter(g => g.status === 'draft').length}</div>
            <div className="text-gray-300 text-sm font-body">Borradores</div>
          </div>
        </div>
      </div>

      {/* Lista de instancias */}
      {filteredInstances.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
          <div className="text-6xl mb-6">🎰</div>
          <h3 className="text-2xl font-bold text-white mb-4 font-display">
            {gameInstances.length === 0 ? '¡Crea tu primera instancia!' : 'No se encontraron instancias'}
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto font-body">
            {gameInstances.length === 0 
              ? 'Empieza creando una instancia de ruleta personalizada para tus campañas' 
              : 'Prueba ajustando los filtros o términos de búsqueda'
            }
          </p>
          {gameInstances.length === 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin/games/roulette/new"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center space-x-3"
              >
                <span>🎰</span>
                <span>Crear Primera Instancia</span>
              </Link>
              
              <Link
                to="/studio"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center space-x-3"
              >
                <span>🏭</span>
                <span>Ir al STUDIO</span>
              </Link>
            </div>
          )}
          {roulettesError && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">Error: {roulettesError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInstances.map((instance) => (
            <div key={instance.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between">
                
                {/* Información de la Instancia */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-3xl">
                    {getGameIcon(instance.type)}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">{instance.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{instance.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(instance.status)}`}>
                        {getStatusText(instance.status)}
                      </span>
                      <span className="text-gray-400">
                        Actualizado {instance.updatedAt.toLocaleDateString()}
                      </span>
                      {instance.isPublic && (
                        <span className="text-green-400 text-xs">
                          🌐 Público
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-3">
                  
                  {/* Editar Instancia */}
                  <Link
                    to={`/admin/games/roulette/${instance.id}`}
                    className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors text-sm border border-purple-400/30 flex items-center space-x-1"
                    title="Editar configuración de esta instancia"
                  >
                    <span>✏️</span>
                    <span>Editar</span>
                  </Link>
                  
                  {/* Link del Juego */}
                  {instance.isPublic && instance.url ? (
                    <button
                      onClick={() => copyToClipboard(instance.url)}
                      className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm border border-blue-400/30 flex items-center space-x-1"
                      title="Copiar enlace público del juego"
                    >
                      <span>🔗</span>
                      <span>Link</span>
                    </button>
                  ) : (
                    <span className="bg-gray-500/20 text-gray-400 px-4 py-2 rounded-lg text-sm border border-gray-400/30 flex items-center space-x-1">
                      <span>🔗</span>
                      <span>No publicado</span>
                    </span>
                  )}
                  
                  {/* QR Code */}
                  {instance.isPublic && instance.url ? (
                    <button
                      onClick={() => {
                        const qrUrl = generateQRCode(instance.url);
                        window.open(qrUrl, '_blank');
                      }}
                      className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm border border-green-400/30 flex items-center space-x-1"
                      title="Generar código QR"
                    >
                      <span>📱</span>
                      <span>QR</span>
                    </button>
                  ) : (
                    <span className="bg-gray-500/20 text-gray-400 px-4 py-2 rounded-lg text-sm border border-gray-400/30 flex items-center space-x-1">
                      <span>📱</span>
                      <span>QR</span>
                    </span>
                  )}
                  
                  {/* Duplicar */}
                  <button
                    onClick={() => handleDuplicate(instance.id, instance.name)}
                    disabled={actionLoading === instance.id}
                    className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm border border-yellow-400/30 flex items-center space-x-1 disabled:opacity-50"
                    title="Crear una copia de esta instancia"
                  >
                    {actionLoading === instance.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>Copia</span>
                      </>
                    )}
                  </button>
                  
                  {/* Eliminar */}
                  <button
                    onClick={() => handleDelete(instance.id, instance.name)}
                    disabled={actionLoading === instance.id}
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm border border-red-400/30 disabled:opacity-50"
                    title="Eliminar esta instancia"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesManagement;
