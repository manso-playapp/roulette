import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        console.log('🔐 Attempting login with:', email);
        await signIn(email, password);
        console.log('✅ Login successful');
      } else {
        console.log('📝 Attempting signup with:', email);
        await signUp(email, password, displayName);
        console.log('✅ Signup successful');
      }
      
      // Pequeña pausa para asegurar que el estado se actualice
      setTimeout(() => {
        onClose();
        setEmail('');
        setPassword('');
        setDisplayName('');
      }, 100);
      
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      setError(error.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-title text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Tu nombre"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isLogin 
              ? '¿No tienes cuenta? Regístrate' 
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Desarrollador:</strong> Usa tu email registrado para acceso completo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthButton() {
  const [showModal, setShowModal] = useState(false);
  const { user, logout, isDeveloper, isClient } = useAuth();

  // Debug logs
  console.log('🔍 AuthButton render - User:', user);
  console.log('🔍 AuthButton render - isDeveloper:', isDeveloper, 'isClient:', isClient);

  if (user) {
    console.log('✅ User is logged in, showing user info');
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <span className="text-sm text-gray-600">Hola, {user.displayName || user.email}</span>
          {isDeveloper && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Desarrollador
            </span>
          )}
          {isClient && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Cliente
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Salir
        </button>
      </div>
    );
  }

  console.log('❌ No user detected, showing login button');
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 font-medium"
      >
        Acceder
      </button>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
