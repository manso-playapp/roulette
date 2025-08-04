import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

export const DebugPanel: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(true); // Inicia minimizado

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white rounded-lg text-xs z-50 transition-all duration-300 shadow-lg">
      {/* Header minimizable */}
      <div 
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/10 rounded-lg select-none"
        onClick={() => setIsMinimized(!isMinimized)}
        title="Click para expandir/contraer"
      >
        <span className="font-bold font-display">🔍 Debug</span>
        <span className="text-xs ml-2">
          {isMinimized ? '▼' : '▲'}
        </span>
      </div>
      
      {/* Contenido expandible */}
      {!isMinimized && (
        <div className="px-3 pb-3 pt-1 max-w-sm border-t border-white/20 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 mt-2">
            <div><strong>Ruta:</strong> {location.pathname}</div>
            <div><strong>Loading:</strong> {loading ? '✅' : '❌'}</div>
            <div><strong>Usuario:</strong> {user ? '✅ ' + user.email : '❌ No autenticado'}</div>
            <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
            <div><strong>UID:</strong> {user?.uid || 'N/A'}</div>
          </div>
        </div>
      )}
    </div>
  );
};
