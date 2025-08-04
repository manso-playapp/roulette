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
              <a href="/" className="flex items-center space-x-3">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 1340 284.8" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="playapp-gradient-header-main" x1="27.2" y1="144.8" x2="1319.4" y2="144.8" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#9333ea"/>
                        <stop offset=".1" stopColor="#873de9"/>
                        <stop offset=".4" stopColor="#6758e9"/>
                        <stop offset=".8" stopColor="#3484e9"/>
                        <stop offset="1" stopColor="#0ea5e9"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#playapp-gradient-header-main)" d="M250.2,38.7c11.2,7.8,16.7,19.1,16.7,33.7,0,21.3-5.6,38.3-16.7,51-13.8,16-35,24-63.8,24h-97.5l-12.5,66.1H27.2L63.3,26.9h143.2c17.9,0,32.5,3.9,43.7,11.8ZM206.3,100.3c4.2-5.6,6.3-11.8,6.3-18.8s-1.8-9.7-5.5-12.4c-3.7-2.7-9.4-4.1-17.3-4.1h-85l-8.9,46.5h84.7c11.1,0,19.7-3.7,25.6-11.2ZM285.3,24.3h48.1l-36.6,189.2h-48.1l36.6-189.2ZM493.4,196.7c-.5,2.9-.8,5.4-.8,7.7,0,3.3.6,5.8,1.8,7.6l-.3,1.6h-47.3c-1.4-1.7-2.1-4.3-2.1-7.6s.3-5,.8-7.6l1-4.7c-8.7,8.5-19.2,14.9-31.4,19-12.2,4.1-26.5,6.1-42.9,6.1s-31.7-3.4-42.3-10.2c-10.6-6.8-15.9-17.3-15.9-31.4s4.6-27.1,13.7-34.9c9.1-7.8,22.3-12.4,39.3-14l74-6.3c6.4-.5,11.2-2,14.1-4.3,3-2.4,4.4-5.3,4.4-8.8s-2.4-6.1-7.2-8c-4.8-1.8-13.2-2.7-25.2-2.7s-19.3,1.3-26.7,3.9c-7.3,2.6-11.8,6.9-13.3,12.8h-52c3-14.8,10.8-26.1,23.5-34,8.2-5.1,18.3-8.6,30.2-10.7,11.9-2.1,25.8-3.1,41.7-3.1,26.5,0,46.4,2.6,59.7,7.7,13.3,5.1,20,14.4,20,27.8s-.4,6.4-1,9.1l-14.9,78.9c-.2,1-.5,3-1,5.9ZM455,145.6c-3,1.7-7.6,3-13.9,3.7l-53.3,6.3c-7.1.9-12.7,2.8-16.7,5.9-4,3.1-6.1,7.3-6.3,12.7,0,5.6,2.1,9.5,6.4,11.6,4.3,2.2,10.7,3.3,19.2,3.3,15.3,0,29.1-3,41.3-8.9,12.2-5.9,19.5-15.3,22-28.2l1.3-6.3ZM606.1,220.1c-7.1,9.9-13.8,17.8-19.9,23.7-6.1,5.8-12.5,10.4-19.1,13.7-5.9,3-12.5,5-19.6,6.1-7.1,1.1-15.9,1.7-26.1,1.7s-23-.3-31.4-.8l7.6-39.2c7.1.5,15.3.8,24.6.8s14.2-1,18.6-3.1c2.3-.9,4.6-2.2,7.1-4.1,2.4-1.8,4.5-4.1,6.3-6.7l4.4-6-47.8-133.6h52.3l29.5,92.5h1.3l62.2-92.5h57l-106.9,147.4ZM843.9,179.5h-109.3l-22.7,34h-57.2L784.9,26.9h62.7l58.6,186.6h-51.8l-10.5-34ZM832.4,141.9l-22.2-72.7h-1.3l-48.9,72.7h72.4ZM958.6,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM978.2,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1ZM1162.1,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM1181.7,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1Z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Navegación */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                Inicio
              </a>
              <a href="/demo" className="text-gray-700 hover:text-gray-900 transition-colors">
                Demo
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
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 1340 284.8" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="playapp-gradient-footer-main" x1="27.2" y1="144.8" x2="1319.4" y2="144.8" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#9333ea"/>
                        <stop offset=".1" stopColor="#873de9"/>
                        <stop offset=".4" stopColor="#6758e9"/>
                        <stop offset=".8" stopColor="#3484e9"/>
                        <stop offset="1" stopColor="#0ea5e9"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#playapp-gradient-footer-main)" d="M250.2,38.7c11.2,7.8,16.7,19.1,16.7,33.7,0,21.3-5.6,38.3-16.7,51-13.8,16-35,24-63.8,24h-97.5l-12.5,66.1H27.2L63.3,26.9h143.2c17.9,0,32.5,3.9,43.7,11.8ZM206.3,100.3c4.2-5.6,6.3-11.8,6.3-18.8s-1.8-9.7-5.5-12.4c-3.7-2.7-9.4-4.1-17.3-4.1h-85l-8.9,46.5h84.7c11.1,0,19.7-3.7,25.6-11.2ZM285.3,24.3h48.1l-36.6,189.2h-48.1l36.6-189.2ZM493.4,196.7c-.5,2.9-.8,5.4-.8,7.7,0,3.3.6,5.8,1.8,7.6l-.3,1.6h-47.3c-1.4-1.7-2.1-4.3-2.1-7.6s.3-5,.8-7.6l1-4.7c-8.7,8.5-19.2,14.9-31.4,19-12.2,4.1-26.5,6.1-42.9,6.1s-31.7-3.4-42.3-10.2c-10.6-6.8-15.9-17.3-15.9-31.4s4.6-27.1,13.7-34.9c9.1-7.8,22.3-12.4,39.3-14l74-6.3c6.4-.5,11.2-2,14.1-4.3,3-2.4,4.4-5.3,4.4-8.8s-2.4-6.1-7.2-8c-4.8-1.8-13.2-2.7-25.2-2.7s-19.3,1.3-26.7,3.9c-7.3,2.6-11.8,6.9-13.3,12.8h-52c3-14.8,10.8-26.1,23.5-34,8.2-5.1,18.3-8.6,30.2-10.7,11.9-2.1,25.8-3.1,41.7-3.1,26.5,0,46.4,2.6,59.7,7.7,13.3,5.1,20,14.4,20,27.8s-.4,6.4-1,9.1l-14.9,78.9c-.2,1-.5,3-1,5.9ZM455,145.6c-3,1.7-7.6,3-13.9,3.7l-53.3,6.3c-7.1.9-12.7,2.8-16.7,5.9-4,3.1-6.1,7.3-6.3,12.7,0,5.6,2.1,9.5,6.4,11.6,4.3,2.2,10.7,3.3,19.2,3.3,15.3,0,29.1-3,41.3-8.9,12.2-5.9,19.5-15.3,22-28.2l1.3-6.3ZM606.1,220.1c-7.1,9.9-13.8,17.8-19.9,23.7-6.1,5.8-12.5,10.4-19.1,13.7-5.9,3-12.5,5-19.6,6.1-7.1,1.1-15.9,1.7-26.1,1.7s-23-.3-31.4-.8l7.6-39.2c7.1.5,15.3.8,24.6.8s14.2-1,18.6-3.1c2.3-.9,4.6-2.2,7.1-4.1,2.4-1.8,4.5-4.1,6.3-6.7l4.4-6-47.8-133.6h52.3l29.5,92.5h1.3l62.2-92.5h57l-106.9,147.4ZM843.9,179.5h-109.3l-22.7,34h-57.2L784.9,26.9h62.7l58.6,186.6h-51.8l-10.5-34ZM832.4,141.9l-22.2-72.7h-1.3l-48.9,72.7h72.4ZM958.6,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM978.2,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1ZM1162.1,197.8l-12.5,64h-48.4l36.9-189.2h47.3l-3.7,19.1h1.3c8.4-7.5,17.5-13.2,27.4-17,9.9-3.8,21.4-5.8,34.5-5.8,23.9,0,42.3,5.1,55.2,15.3,12.9,10.2,19.3,24.8,19.3,43.8s-2,22.2-6.1,33.2c-4.1,11-9.8,20.5-17.1,28.5-17.4,19.3-42.9,29-76.3,29s-45.1-7-56.5-20.9h-1.3ZM1181.7,123.4c-3.5,4.2-6.2,8.8-8.2,14-2,5.1-3,10.3-3,15.6,0,9.6,3.5,17.1,10.6,22.6,7.1,5.5,17.5,8.2,31.2,8.2,20.4,0,35.6-6.2,45.7-18.6,3.3-4.4,5.9-9.3,7.8-14.9,1.9-5.6,2.9-11.2,2.9-16.7,0-19.5-13.7-29.3-41-29.3s-35.4,6.4-46,19.1Z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma de gamificación más avanzada para potenciar tu marketing.
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
                © 2025 PlayApp. Todos los derechos reservados.
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
