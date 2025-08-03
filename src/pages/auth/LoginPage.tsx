import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, loginAsDemo, user } = useAuth();
  const navigate = useNavigate();

  // Redireccionar si ya está logueado
  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // La redirección se manejará automáticamente por el useEffect
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Mensajes de error más amigables
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Intenta más tarde';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para login rápido de desarrollador
  const handleDevLogin = () => {
    setEmail('grupomanso@gmail.com');
    setPassword(''); // El usuario deberá ingresar la contraseña
  };

  // Función para login demo
  const handleDemoLogin = async () => {
    console.log('🎯 Iniciando login demo...');
    setLoading(true);
    setError('');
    
    try {
      await loginAsDemo();
      console.log('🎯 Login demo exitoso');
      // La redirección se manejará automáticamente por el useEffect
    } catch (error) {
      console.error('❌ Error en login demo:', error);
      setError('Error al iniciar sesión demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎰</div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">Iniciar Sesión</h1>
          <p className="text-gray-300 font-body">Accede a tu dashboard de administración</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-white font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚡</span>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Ingresar al Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Login rápido de desarrollador y demo */}
          <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-purple-500/20 border border-purple-400/30 text-purple-400 py-3 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>🎯</span>
              <span>Acceso Demo Admin</span>
            </button>
            
            <button
              onClick={handleDevLogin}
              className="w-full bg-green-500/20 border border-green-400/30 text-green-400 py-3 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center space-x-2"
            >
              <span>👨‍💻</span>
              <span>Login como Desarrollador</span>
            </button>
          </div>

          {/* Enlaces */}
          <div className="mt-6 text-center space-y-2">
            <div>
              <span className="text-gray-400">¿No tienes cuenta? </span>
              <Link 
                to="/auth/register" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Regístrate aquí
              </Link>
            </div>
            
            <div>
              <Link 
                to="/" 
                className="text-gray-400 hover:text-white text-sm"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Demo del sistema */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">¿Quieres probar sin cuenta?</p>
          <Link
            to="/demo"
            className="inline-flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <span>🎮</span>
            <span>Ver Demo Interactivo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
