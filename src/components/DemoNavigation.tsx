import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const DemoNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
        <div className="flex space-x-3">
          <Link
            to="/demo"
            className={`
              px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
              ${location.pathname === '/demo' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span>🎰</span>
            <span>Demo</span>
          </Link>
          
          <Link
            to="/demo/config"
            className={`
              px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
              ${location.pathname === '/demo/config' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span>⚙️</span>
            <span>Personalizar</span>
          </Link>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <Link
            to="/"
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>🏠</span>
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
