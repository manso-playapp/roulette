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
import Analytics from '../pages/admin/Analytics';
import GamesManagement from '../pages/admin/GamesManagement';
import Settings from '../pages/admin/Settings';
import Blueprints from '../pages/admin/Blueprints';

// Pages de autenticación
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Pages admin
import RouletteEditor from '../pages/admin/RouletteEditor';
import { PlatformConfigPage } from '../pages/admin/PlatformConfig';

// Debug
import { DebugPanel } from '../components/DebugPanel';

// Páginas demo
import { RouletteDemoPage } from '../pages/demo/RouletteDemoPage';
import { RouletteAdvancedConfigPage } from '../pages/demo/RouletteAdvancedConfigPage';

// Páginas de test
import TestRouletteNewPage from '../pages/test/TestRouletteNewPage';

// Páginas de configuración
import RouletteConfigPage from '../pages/config/RouletteConfigPage';

// Páginas placeholder (las implementaremos una por una)
import {
  GameEditor,
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

  // Debug logs
  console.log('🔍 AppRouter - user:', user);
  console.log('🔍 AppRouter - loading:', loading);

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
    <>
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
        {/* PÁGINAS DEMO */}
        {/* ============================================ */}
        
        <Route path="/demo" element={<MainLayout />}>
          <Route index element={<RouletteDemoPage />} />
          <Route path="config" element={<RouletteAdvancedConfigPage />} />
          <Route path="roulette-new" element={<TestRouletteNewPage />} />
        </Route>

        {/* ============================================ */}
        {/* ADMIN DASHBOARD (PROTEGIDO) */}
        {/* ============================================ */}
        
        <Route 
          path="/admin" 
          element={
            (() => {
              console.log('🔒 Ruta admin - user:', user);
              console.log('🔒 Ruta admin - ¿autenticado?:', !!user);
              return user ? <AdminLayout /> : <Navigate to="/auth/login" replace />;
            })()
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="games" element={<GamesManagement />} />
          <Route path="games/roulette/new" element={<RouletteEditor />} />
          <Route path="games/roulette/:id" element={<RouletteEditor />} />
          <Route path="games/new" element={<GameEditor />} />
          <Route path="games/:gameId/edit" element={<GameEditor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="blueprints" element={<Blueprints />} />
          <Route path="settings" element={<Settings />} />
          <Route path="platform-config" element={<PlatformConfigPage />} />
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
      
      {/* Panel de debug para desarrollo */}
      <DebugPanel />
    </>
  );
};

export default AppRouter;
