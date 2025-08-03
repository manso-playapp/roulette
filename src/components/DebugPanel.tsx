import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

export const DebugPanel: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2 font-display">🔍 Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Ruta:</strong> {location.pathname}</div>
        <div><strong>Loading:</strong> {loading ? '✅' : '❌'}</div>
        <div><strong>Usuario:</strong> {user ? '✅ ' + user.email : '❌ No autenticado'}</div>
        <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
        <div><strong>UID:</strong> {user?.uid || 'N/A'}</div>
      </div>
    </div>
  );
};
