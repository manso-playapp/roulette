import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { VersionInfo } from '../../components/VersionInfo';

interface UserSettings {
  displayName: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
    gameUpdates: boolean;
    analytics: boolean;
  };
  privacy: {
    profilePublic: boolean;
    gameStatsPublic: boolean;
    allowAnalytics: boolean;
  };
  platform: {
    autoSave: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    defaultGameType: 'roulette' | 'trivia' | 'scratch';
  };
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    email: '',
    notifications: {
      email: true,
      push: false,
      gameUpdates: true,
      analytics: true,
    },
    privacy: {
      profilePublic: false,
      gameStatsPublic: true,
      allowAnalytics: true,
    },
    platform: {
      autoSave: true,
      theme: 'dark',
      language: 'es',
      defaultGameType: 'roulette',
    },
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'platform' | 'account'>('profile');

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaved(true);
    setLoading(false);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await logout();
    }
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    if (section === 'displayName' || section === 'email') {
      setSettings(prev => ({
        ...prev,
        [section]: value,
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [key]: value,
        },
      }));
    }
  };

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: '👤' },
    { id: 'notifications', name: 'Notificaciones', icon: '🔔' },
    { id: 'privacy', name: 'Privacidad', icon: '🔒' },
    { id: 'platform', name: 'Plataforma', icon: '⚙️' },
    { id: 'account', name: 'Cuenta', icon: '🏠' },
  ];

  return (
    <div className="max-w-6xl mx-auto">{/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">⚙️ Configuración</h1>
            <p className="text-gray-300">Personaliza tu experiencia en la plataforma</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {saved && (
              <div className="bg-green-500/20 border border-green-400/30 text-green-400 px-4 py-2 rounded-lg">
                ✅ Configuración guardada
              </div>
            )}
            
            <Link
              to="/admin/dashboard"
              className="bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navegación de pestañas */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 sticky top-6">
              <h2 className="text-lg font-bold text-white mb-4">Configuración</h2>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Información del usuario */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {user?.displayName || 'Usuario'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de configuración */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              
              {/* Tab: Perfil */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">👤 Información del Perfil</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Nombre para mostrar</label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => updateSettings('displayName' as any, '', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        disabled
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-gray-400 text-sm mt-1">El email no se puede cambiar desde aquí</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">📊 Estadísticas del Perfil</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">12</div>
                          <div className="text-gray-300 text-sm">Juegos Creados</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">1,284</div>
                          <div className="text-gray-300 text-sm">Jugadores Únicos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">4.8</div>
                          <div className="text-gray-300 text-sm">Rating Promedio</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Notificaciones */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">🔔 Notificaciones</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Email</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">Notificaciones por email</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => updateSettings('notifications', 'email', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">Actualizaciones de juegos</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.gameUpdates}
                            onChange={(e) => updateSettings('notifications', 'gameUpdates', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">Reportes de analytics</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.analytics}
                            onChange={(e) => updateSettings('notifications', 'analytics', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Push</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-300">Notificaciones push</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => updateSettings('notifications', 'push', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Privacidad */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">🔒 Privacidad</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Visibilidad</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-300">Perfil público</span>
                            <p className="text-gray-400 text-sm">Permite que otros vean tu perfil</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.privacy.profilePublic}
                            onChange={(e) => updateSettings('privacy', 'profilePublic', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-300">Estadísticas públicas</span>
                            <p className="text-gray-400 text-sm">Muestra tus estadísticas de juegos</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.privacy.gameStatsPublic}
                            onChange={(e) => updateSettings('privacy', 'gameStatsPublic', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Datos</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-300">Permitir analytics</span>
                            <p className="text-gray-400 text-sm">Ayúdanos a mejorar la plataforma</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.privacy.allowAnalytics}
                            onChange={(e) => updateSettings('privacy', 'allowAnalytics', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Plataforma */}
              {activeTab === 'platform' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">⚙️ Configuración de Plataforma</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Preferencias</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-300 font-medium mb-2">Tema</label>
                          <select
                            value={settings.platform.theme}
                            onChange={(e) => updateSettings('platform', 'theme', e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                            <option value="auto">Automático</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 font-medium mb-2">Idioma</label>
                          <select
                            value={settings.platform.language}
                            onChange={(e) => updateSettings('platform', 'language', e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="pt">Português</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 font-medium mb-2">Tipo de juego por defecto</label>
                          <select
                            value={settings.platform.defaultGameType}
                            onChange={(e) => updateSettings('platform', 'defaultGameType', e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="roulette">Ruleta</option>
                            <option value="trivia">Trivia</option>
                            <option value="scratch">Raspadita</option>
                          </select>
                        </div>

                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-300">Guardado automático</span>
                            <p className="text-gray-400 text-sm">Guarda cambios automáticamente</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.platform.autoSave}
                            onChange={(e) => updateSettings('platform', 'autoSave', e.target.checked)}
                            className="toggle-checkbox"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Cuenta */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">🏠 Gestión de Cuenta</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Seguridad</h3>
                      <div className="space-y-4">
                        <button className="w-full bg-blue-500/20 border border-blue-400/30 text-blue-400 py-3 rounded-lg hover:bg-blue-500/30 transition-colors">
                          🔐 Cambiar Contraseña
                        </button>
                        <button className="w-full bg-purple-500/20 border border-purple-400/30 text-purple-400 py-3 rounded-lg hover:bg-purple-500/30 transition-colors">
                          📱 Configurar 2FA
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">Datos</h3>
                      <div className="space-y-4">
                        <button className="w-full bg-green-500/20 border border-green-400/30 text-green-400 py-3 rounded-lg hover:bg-green-500/30 transition-colors">
                          📥 Exportar mis datos
                        </button>
                        <button className="w-full bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 py-3 rounded-lg hover:bg-yellow-500/30 transition-colors">
                          🔄 Hacer backup
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-500/10 rounded-lg p-6 border border-red-400/30">
                      <h3 className="text-red-400 font-semibold mb-4">Zona de Peligro</h3>
                      <div className="space-y-4">
                        <button
                          onClick={handleLogout}
                          className="w-full bg-orange-500/20 border border-orange-400/30 text-orange-400 py-3 rounded-lg hover:bg-orange-500/30 transition-colors"
                        >
                          🚪 Cerrar Sesión
                        </button>
                        <button className="w-full bg-red-500/20 border border-red-400/30 text-red-400 py-3 rounded-lg hover:bg-red-500/30 transition-colors">
                          🗑️ Eliminar Cuenta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de guardar */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⚡</span>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Guardar Configuración</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Información de versión */}
            <div className="mt-8">
              <VersionInfo />
            </div>
          </div>
        </div>
    </div>
  );
};

export default Settings;
