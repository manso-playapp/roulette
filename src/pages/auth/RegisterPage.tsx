import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redireccionar si ya está logueado
  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(formData.email, formData.password, formData.displayName);
      // La redirección se manejará automáticamente por el useEffect
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Mensajes de error más amigables
      let errorMessage = 'Error al crear la cuenta';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Ya existe una cuenta con este email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      }
      
      setError(errorMessage);
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
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-gray-300">Únete y crea juegos interactivos increíbles</p>
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
            
            {/* Nombre para mostrar */}
            <div>
              <label className="block text-white font-medium mb-2">
                Nombre para mostrar
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={loading}
              />
              <p className="text-gray-400 text-sm mt-1">Mínimo 6 caracteres</p>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-white font-medium mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚡</span>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Crear mi cuenta</span>
                </>
              )}
            </button>
          </form>

          {/* Enlaces */}
          <div className="mt-6 text-center space-y-2">
            <div>
              <span className="text-gray-400">¿Ya tienes cuenta? </span>
              <Link 
                to="/auth/login" 
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Inicia sesión aquí
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

        {/* Información adicional */}
        <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
            <span>✨</span>
            <span>¿Qué puedes hacer con tu cuenta?</span>
          </h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Crear juegos interactivos (ruletas, trivias, raspaditas)</li>
            <li>• Dashboard con analytics y métricas</li>
            <li>• Gestionar premios y participantes</li>
            <li>• Personalizar completamente tus juegos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
