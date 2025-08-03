import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  FolderOpen, 
  Home, 
  ShoppingCart, 
  User, 
  Settings,
  TrendingUp,
  Activity,
  PlusCircle,
  BarChart3,
  Gamepad2,
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
  Circle,
  DollarSign,
  Shield,
  LogIn,
  UserPlus,
  Users,
  CircleDot,
  LayoutDashboard,
  Plus,
  Edit,
  Dice6,
  Zap,
  Monitor,
  Smartphone,
  Play,
  Gift,
  ChevronRight,
  MapPin
} from 'lucide-react';
import Icon from '../../components/Icon';

interface RouteNode {
  path: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'future';
  icon: React.ComponentType<any>;
  children?: RouteNode[];
  layout?: string;
  component?: string;
  features?: string[];
  notes?: string;
}

const Blueprints: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<RouteNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['/', '/admin', '/demo', '/game', '/play']));

  const projectStructure: RouteNode[] = [
    {
      path: '/',
      name: 'Landing Público',
      description: 'Página principal y ventas',
      status: 'completed',
      icon: Home,
      layout: 'MainLayout',
      component: 'LandingPage',
      features: ['Hero Section', 'Pricing', 'Call to Action'],
      children: [
        {
          path: '/pricing',
          name: 'Planes y Precios',
          description: 'Página de precios y suscripciones',
          status: 'pending',
          icon: DollarSign,
          component: 'PricingPage',
          features: ['Comparación de planes', 'Botones de compra']
        },
        {
          path: '/checkout/:plan',
          name: 'Proceso de Compra',
          description: 'Checkout y pagos',
          status: 'future',
          icon: ShoppingCart,
          component: 'CheckoutPage',
          features: ['Stripe/PayPal', 'Formulario de pago']
        }
      ]
    },
    {
      path: '/auth',
      name: 'Autenticación',
      description: 'Login y registro de usuarios',
      status: 'completed',
      icon: Shield,
      layout: 'MainLayout',
      children: [
        {
          path: '/auth/login',
          name: 'Iniciar Sesión',
          description: 'Login con Firebase Auth',
          status: 'completed',
          icon: LogIn,
          component: 'LoginPage',
          features: ['Email/Password', 'Google Auth', 'Recordar sesión']
        },
        {
          path: '/auth/register',
          name: 'Registro',
          description: 'Crear cuenta nueva',
          status: 'completed',
          icon: UserPlus,
          component: 'RegisterPage',
          features: ['Validación email', 'Política de privacidad']
        }
      ]
    },
    {
      path: '/demo',
      name: 'Modo Demostración',
      description: 'Versión demo para probar funcionalidades',
      status: 'in-progress',
      icon: Users,
      layout: 'MainLayout',
      children: [
        {
          path: '/demo',
          name: 'Demo Básico',
          description: 'Ruleta demo simple',
          status: 'completed',
          icon: CircleDot,
          component: 'RouletteDemoPage',
          features: ['Ruleta funcional', 'Sectores predefinidos']
        },
        {
          path: '/demo/config',
          name: 'Demo Avanzado',
          description: 'Configuración avanzada demo',
          status: 'in-progress',
          icon: Settings,
          component: 'RouletteAdvancedConfigPage',
          features: ['Personalización en vivo', 'Colores', 'Probabilidades']
        }
      ]
    },
    {
      path: '/admin',
      name: 'Panel de Administración',
      description: 'Dashboard completo para clientes',
      status: 'in-progress',
      icon: LayoutDashboard,
      layout: 'AdminLayout',
      notes: 'Núcleo del sistema - Protegido por autenticación',
      children: [
        {
          path: '/admin',
          name: 'Dashboard Principal',
          description: 'Resumen general y métricas',
          status: 'completed',
          icon: LayoutDashboard,
          component: 'Dashboard',
          features: ['Estadísticas generales', 'Accesos rápidos', 'Actividad reciente']
        },
        {
          path: '/admin/blueprints',
          name: 'Blueprints del Sistema',
          description: 'Mapa visual del proyecto completo',
          status: 'completed',
          icon: MapPin,
          component: 'Blueprints',
          features: ['Navegación visual', 'Estado de desarrollo', 'Arquitectura']
        },
        {
          path: '/admin/games',
          name: 'Gestión de Juegos',
          description: 'CRUD de juegos y campañas',
          status: 'in-progress',
          icon: Gamepad2,
          component: 'GamesManagement',
          features: ['Lista de juegos', 'Crear/Editar', 'Activar/Desactivar'],
          children: [
            {
              path: '/admin/games/roulette/new',
              name: 'Nueva Ruleta',
              description: 'Crear ruleta desde cero',
              status: 'in-progress',
              icon: Plus,
              component: 'RouletteEditor',
              features: ['Configuración general', 'Personalización visual', 'Sectores desplegables']
            },
            {
              path: '/admin/games/roulette/:id',
              name: 'Editar Ruleta',
              description: 'Modificar ruleta existente',
              status: 'in-progress',
              icon: Edit,
              component: 'RouletteEditor',
              features: ['Vista previa en tiempo real', 'Botón de prueba', 'Guardar cambios']
            },
            {
              path: '/admin/games/new',
              name: 'Nuevo Juego (General)',
              description: 'Crear otros tipos de juegos',
              status: 'future',
              icon: Dice6,
              component: 'GameEditor',
              features: ['Múltiples tipos', 'Plantillas', 'Configuración modular']
            },
            {
              path: '/admin/games/:gameId/edit',
              name: 'Editar Juego (General)',
              description: 'Editor universal de juegos',
              status: 'future',
              icon: Zap,
              component: 'GameEditor',
              features: ['Editor visual', 'Previsualización', 'Publicación']
            }
          ]
        },
        {
          path: '/admin/analytics',
          name: 'Analytics y Reportes',
          description: 'Métricas detalladas y estadísticas',
          status: 'pending',
          icon: TrendingUp,
          component: 'Analytics',
          features: ['Gráficos interactivos', 'Filtros por fecha', 'Exportar datos']
        },
        {
          path: '/admin/health',
          name: 'Estado de Servicios',
          description: 'Monitoreo de conexiones y salud del sistema',
          status: 'completed',
          icon: Activity,
          component: 'HealthCheck',
          features: ['Firebase status', 'API endpoints', 'Conectividad']
        },
        {
          path: '/admin/settings',
          name: 'Configuración',
          description: 'Ajustes de cuenta y sistema',
          status: 'pending',
          icon: Settings,
          component: 'Settings',
          features: ['Perfil usuario', 'Preferencias', 'Integrations']
        }
      ]
    },
    {
      path: '/game/:gameId',
      name: 'Juego Público (TV)',
      description: 'Interfaz para pantallas y televisores',
      status: 'future',
      icon: Monitor,
      layout: 'GameLayout',
      component: 'GamePublic',
      notes: 'URL principal que se proyecta en pantallas',
      features: ['Pantalla completa', 'QR dinámico', 'Animaciones suaves', 'Responsive TV']
    },
    {
      path: '/play/:gameId',
      name: 'Flujo de Participación (Móvil)',
      description: 'Experiencia móvil para participantes',
      status: 'future',
      icon: Smartphone,
      layout: 'GameLayout',
      notes: 'Flujo completo desde QR hasta premio',
      children: [
        {
          path: '/play/:gameId',
          name: 'Registro de Participante',
          description: 'Formulario inicial móvil',
          status: 'future',
          icon: FileText,
          component: 'ParticipantRegistration',
          features: ['Formulario simple', 'Validación', 'Términos y condiciones']
        },
        {
          path: '/play/:gameId/spin',
          name: 'Jugar (Girar)',
          description: 'Interfaz de juego móvil',
          status: 'future',
          icon: Play,
          component: 'PlayGame',
          features: ['Botón de giro', 'Animación', 'Sincronización con TV']
        },
        {
          path: '/play/:gameId/thanks',
          name: 'Página de Agradecimiento',
          description: 'Resultado final y premio',
          status: 'future',
          icon: Gift,
          component: 'ThankYou',
          features: ['Mostrar premio', 'Compartir social', 'Follow-up']
        }
      ]
    }
  ];

  const getStatusColor = (status: RouteNode['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      case 'future': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: RouteNode['status']) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Desarrollo';
      case 'pending': return 'Pendiente';
      case 'future': return 'Futuro';
      default: return 'Sin Estado';
    }
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: RouteNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.path);
    
    return (
      <div key={node.path} className="mb-2">
        <div
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
            selectedRoute?.path === node.path ? 'bg-purple-500/20 border border-purple-500/50' : 'border border-white/10'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => setSelectedRoute(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.path);
              }}
              className="mr-2 p-1 hover:bg-white/20 rounded transition-colors"
            >
              <ChevronRight 
                size={16} 
                className={`transform transition-transform text-gray-400 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          )}
          
          <div className="mr-3">
            <node.icon size={20} className="text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <span className="text-white font-medium font-display">{node.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                {getStatusText(node.status)}
              </span>
            </div>
            <div className="text-gray-300 text-sm font-body">{node.description}</div>
            {node.path !== '/' && (
              <div className="text-gray-400 text-xs font-mono mt-1">{node.path}</div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getProjectStats = () => {
    const allNodes: RouteNode[] = [];
    
    const collectNodes = (nodes: RouteNode[]) => {
      nodes.forEach(node => {
        allNodes.push(node);
        if (node.children) {
          collectNodes(node.children);
        }
      });
    };
    
    collectNodes(projectStructure);
    
    const stats = {
      total: allNodes.length,
      completed: allNodes.filter(n => n.status === 'completed').length,
      inProgress: allNodes.filter(n => n.status === 'in-progress').length,
      pending: allNodes.filter(n => n.status === 'pending').length,
      future: allNodes.filter(n => n.status === 'future').length,
    };
    
    return stats;
  };

  const stats = getProjectStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <MapPin size={32} className="text-white" />
          <h1 className="text-3xl font-bold text-white font-display">Blueprints del Sistema</h1>
        </div>
        <p className="text-gray-400 font-body">
          Mapa visual completo del proyecto - arquitectura, navegación y estado de desarrollo
        </p>
      </div>

      {/* Estadísticas del proyecto */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-white font-display">{stats.total}</div>
          <div className="text-gray-300 text-sm font-body">Total Rutas</div>
        </div>
        <div className="bg-green-400/10 p-4 rounded-lg border border-green-400/20">
          <div className="text-2xl font-bold text-green-400 font-display">{stats.completed}</div>
          <div className="text-green-300 text-sm font-body">Completadas</div>
        </div>
        <div className="bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/20">
          <div className="text-2xl font-bold text-yellow-400 font-display">{stats.inProgress}</div>
          <div className="text-yellow-300 text-sm font-body">En Desarrollo</div>
        </div>
        <div className="bg-orange-400/10 p-4 rounded-lg border border-orange-400/20">
          <div className="text-2xl font-bold text-orange-400 font-display">{stats.pending}</div>
          <div className="text-orange-300 text-sm font-body">Pendientes</div>
        </div>
        <div className="bg-gray-400/10 p-4 rounded-lg border border-gray-400/20">
          <div className="text-2xl font-bold text-gray-400 font-display">{stats.future}</div>
          <div className="text-gray-300 text-sm font-body">Futuras</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Árbol de navegación */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 font-display">Estructura de Navegación</h3>
            <div className="space-y-2">
              {projectStructure.map(node => renderNode(node))}
            </div>
          </div>
        </div>

        {/* Panel de detalles */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            {selectedRoute ? (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <selectedRoute.icon size={28} className="text-white" />
                  <div>
                    <h3 className="text-xl font-semibold text-white font-display">{selectedRoute.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRoute.status)}`}>
                      {getStatusText(selectedRoute.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Descripción</h4>
                    <p className="text-white text-sm">{selectedRoute.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Ruta</h4>
                    <code className="text-purple-300 text-sm bg-white/10 px-2 py-1 rounded">
                      {selectedRoute.path}
                    </code>
                  </div>

                  {selectedRoute.layout && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Layout</h4>
                      <code className="text-blue-300 text-sm bg-white/10 px-2 py-1 rounded">
                        {selectedRoute.layout}
                      </code>
                    </div>
                  )}

                  {selectedRoute.component && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Componente</h4>
                      <code className="text-green-300 text-sm bg-white/10 px-2 py-1 rounded">
                        {selectedRoute.component}
                      </code>
                    </div>
                  )}

                  {selectedRoute.features && selectedRoute.features.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Características</h4>
                      <ul className="space-y-1">
                        {selectedRoute.features.map((feature, index) => (
                          <li key={index} className="text-white text-sm flex items-center space-x-2">
                            <span className="text-green-400">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedRoute.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Notas</h4>
                      <p className="text-yellow-300 text-sm bg-yellow-400/10 p-2 rounded border border-yellow-400/20">
                        {selectedRoute.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2 font-display">Selecciona una ruta</h3>
                <p className="text-gray-400 text-sm">
                  Haz clic en cualquier elemento del árbol para ver sus detalles técnicos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leyenda de estados */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 font-display">Leyenda de Estados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm font-medium">
              Completado
            </span>
            <span className="text-gray-300 text-sm">Funcional y testeado</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium">
              En Desarrollo
            </span>
            <span className="text-gray-300 text-sm">Trabajo en progreso</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-orange-400/20 text-orange-400 rounded-full text-sm font-medium">
              Pendiente
            </span>
            <span className="text-gray-300 text-sm">Planificado próximamente</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-gray-400/20 text-gray-400 rounded-full text-sm font-medium">
              Futuro
            </span>
            <span className="text-gray-300 text-sm">Funcionalidad futura</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blueprints;
