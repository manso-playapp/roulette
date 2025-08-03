import React from 'react';
import { Outlet } from 'react-router-dom';

// Layout principal para landing, auth y páginas públicas
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header público */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GP</span>
                </div>
                <span className="text-xl font-bold text-gray-900">GamesPlatform</span>
              </a>
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                Inicio
              </a>
              <a href="/demo" className="text-gray-700 hover:text-gray-900 transition-colors">
                🎰 Demo Ruleta
              </a>
              <a href="/demo/config" className="text-purple-600 hover:text-purple-800 transition-colors font-semibold">
                ⚙️ Personalizar Ruleta
              </a>
              <a href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
                Precios
              </a>
              <a href="#games" className="text-gray-700 hover:text-gray-900 transition-colors">
                Juegos
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                Contacto
              </a>
            </nav>

            {/* Botones de acción */}
            <div className="flex items-center space-x-4">
              <a 
                href="/auth/login" 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Iniciar Sesión
              </a>
              <a 
                href="/auth/register" 
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-200 font-medium"
              >
                Empezar Gratis
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GP</span>
                </div>
                <span className="text-xl font-bold">GamesPlatform</span>
              </div>
              <p className="text-gray-400 mb-4">
                Plataforma de juegos interactivos para comercios. Crea ruletas, trivias y más juegos personalizados para conectar con tus clientes.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Precios</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a></li>
                <li><a href="#games" className="text-gray-400 hover:text-white transition-colors">Juegos</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            {/* Soporte */}
            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#docs" className="text-gray-400 hover:text-white transition-colors">Documentación</a></li>
                <li><a href="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 GamesPlatform. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacidad
                </a>
                <a href="#terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Términos
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
