import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// Layout para el dashboard de administración
const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊',
      description: 'Resumen general'
    },
    {
      name: 'Mis Juegos',
      path: '/admin/games',
      icon: '🎮',
      description: 'Gestionar juegos'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: '📈',
      description: 'Estadísticas detalladas'
    },
    {
      name: 'Estado de Servicios',
      path: '/admin/health',
      icon: '🔧',
      description: 'Monitoreo de conexiones'
    },
    {
      name: 'Configuración',
      path: '/admin/settings',
      icon: '⚙️',
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
    <div className="min-h-screen admin-bg">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-card-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎮</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">PlayApp</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover-lift ${
                isActive(item.path)
                  ? 'gradient-primary text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className={`text-xs ${
                  isActive(item.path) ? 'text-white opacity-90' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Usuario y logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">👤</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Usuario Demo</div>
              <div className="text-xs text-gray-500">Plan Pro</div>
            </div>
          </div>
          <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Cerrar Sesión
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
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Botón de menú móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>

            {/* Título de página */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Acciones rápidas */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin/games/new')}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-200 font-medium"
              >
                + Nuevo Juego
              </button>
              
              {/* Notificaciones */}
              <button className="relative text-gray-500 hover:text-gray-700">
                🔔
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
