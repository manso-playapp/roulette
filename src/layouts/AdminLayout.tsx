import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Gamepad2, 
  TrendingUp, 
  Activity, 
  Users, 
  Map, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// Layout para el dashboard de administración
const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems: Array<{
    name?: string;
    path?: string;
    icon?: React.ComponentType<any>;
    description?: string;
    external?: boolean;
    separator?: boolean;
  }> = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      description: 'Resumen general'
    },
    {
      name: 'Mis Juegos',
      path: '/admin/games',
      icon: Gamepad2,
      description: 'Gestionar juegos'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: TrendingUp,
      description: 'Estadísticas detalladas'
    },
    // Separador visual
    { separator: true },
    {
      name: 'Estado de Servicios',
      path: '/admin/health',
      icon: Activity,
      description: 'Monitoreo de conexiones'
    },
    {
      name: 'Usuario Demo',
      path: '/demo',
      icon: Users,
      description: 'Modo demostración',
      external: true
    },
    {
      name: 'Blueprints',
      path: '/admin/blueprints',
      icon: Map,
      description: 'Mapa del sistema'
    },
    {
      name: 'Configuración',
      path: '/admin/settings',
      icon: Settings,
      description: 'Ajustes de cuenta'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white/10 backdrop-blur-sm border-r border-white/20 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/20">
          <div className={`flex items-center transition-all duration-300 ${sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Gamepad2 size={20} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white font-title">PlayApp</h1>
                <p className="text-xs text-gray-300">Admin Panel</p>
              </div>
            )}
          </div>
          
          {/* Botón de colapsar/expandir - Solo desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            title={sidebarCollapsed ? 'Expandir panel' : 'Colapsar panel'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          
          {/* Botón de cerrar - Solo móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            // Renderizar separador
            if (item.separator) {
              return (
                <div key={`separator-${index}`} className="my-4">
                  <div className="border-t border-white/20"></div>
                </div>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => {
                  if (item.external) {
                    window.open(item.path!, '_blank');
                  } else {
                    navigate(item.path!);
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive(item.path!)
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}
                title={sidebarCollapsed ? item.name : ''}
              >
                {item.icon && <item.icon size={20} className="text-current" />}
                {!sidebarCollapsed && (
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className={`text-xs ${
                      isActive(item.path!) ? 'text-white opacity-90' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Usuario y logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className={`flex items-center mb-4 ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '👤'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="font-medium text-white text-sm">
                  {user?.displayName || user?.email || 'Usuario'}
                </div>
                <div className="text-xs text-gray-300">
                  {user?.role === 'developer' ? 'Desarrollador' : 'Cliente'}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`w-full bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/20 flex items-center ${
              sidebarCollapsed ? 'justify-center' : 'space-x-2'
            }`}
            title={sidebarCollapsed ? 'Cerrar Sesión' : ''}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-0">
        {/* Botón de menú móvil flotante */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-6 left-6 z-40 bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
