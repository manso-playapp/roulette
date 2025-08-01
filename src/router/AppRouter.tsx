import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import GameLayout from '../layouts/GameLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages principales
import LandingPage from '../pages/landing/LandingPage';
import Dashboard from '../pages/admin/Dashboard';
import HealthCheck from '../pages/admin/HealthCheck';

// Páginas placeholder (las implementaremos una por una)
import {
  LoginPage,
  RegisterPage,
  GamesManagement,
  GameEditor,
  Analytics,
  Settings,
  GamePublic,
  ParticipantRegistration,
  PlayGame,
  ThankYou,
  PricingPage,
  CheckoutPage,
  HomePage
} from '../pages/PlaceholderPages';

// Hooks para autenticación
import { useAuth } from '../hooks/useAuth';

const AppRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl font-semibold mb-2">Iniciando aplicación...</div>
          <div className="text-sm opacity-80">Conectando con Firebase</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
        {/* ============================================ */}
        {/* LANDING PÚBLICO Y VENTAS */}
        {/* ============================================ */}
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="checkout/:plan" element={<CheckoutPage />} />
        </Route>

        {/* ============================================ */}
        {/* AUTENTICACIÓN */}
        {/* ============================================ */}
        
        <Route path="/auth" element={<MainLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* ============================================ */}
        {/* ADMIN DASHBOARD (PROTEGIDO) */}
        {/* ============================================ */}
        
        <Route 
          path="/admin" 
          element={
            user ? <AdminLayout /> : <Navigate to="/auth/login" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="games" element={<GamesManagement />} />
          <Route path="games/new" element={<GameEditor />} />
          <Route path="games/:gameId/edit" element={<GameEditor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="health" element={<HealthCheck />} />
        </Route>

        {/* ============================================ */}
        {/* JUEGOS PÚBLICOS (URLs DINÁMICAS) */}
        {/* ============================================ */}
        
        {/* URL principal del juego para TV/Pantalla */}
        <Route path="/game/:gameId" element={<GameLayout />}>
          <Route index element={<GamePublic />} />
        </Route>

        {/* Flujo de participación móvil */}
        <Route path="/play/:gameId" element={<GameLayout />}>
          <Route index element={<ParticipantRegistration />} />
          <Route path="spin" element={<PlayGame />} />
          <Route path="thanks" element={<ThankYou />} />
        </Route>

        {/* ============================================ */}
        {/* RUTAS DE UTILIDAD */}
        {/* ============================================ */}
        
        {/* Redirecciones de compatibilidad */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        
        {/* 404 - Página no encontrada */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
              <a 
                href="/" 
                className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        } />
      </Routes>
  );
};

export default AppRouter;
