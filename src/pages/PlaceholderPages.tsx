import React from 'react';

// Placeholder para páginas que crearemos después
const PlaceholderPage: React.FC<{ title: string; description: string; icon?: string }> = ({ 
  title, 
  description, 
  icon = "🚧" 
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">{icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-display">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Estado:</strong> En desarrollo. Esta funcionalidad será implementada próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

// Páginas de autenticación
export const LoginPage = () => <PlaceholderPage title="Iniciar Sesión" description="Página de login para acceder al dashboard" icon="🔐" />;
export const RegisterPage = () => <PlaceholderPage title="Crear Cuenta" description="Registro de nuevos usuarios" icon="📝" />;

// Páginas admin
export const GamesManagement = () => <PlaceholderPage title="Gestión de Juegos" description="Lista y administración de todos tus juegos" icon="🎮" />;
export const GameEditor = () => <PlaceholderPage title="Editor de Juegos" description="Editor visual para personalizar juegos" icon="🎨" />;
export const Analytics = () => <PlaceholderPage title="Analytics" description="Estadísticas detalladas y reportes" icon="📊" />;
export const Settings = () => <PlaceholderPage title="Configuración" description="Ajustes de cuenta y preferencias" icon="⚙️" />;

// Páginas de juegos públicos
export const GamePublic = () => <PlaceholderPage title="Vista Pública del Juego" description="Pantalla principal para TV/Display" icon="📺" />;
export const ParticipantRegistration = () => <PlaceholderPage title="Registro de Participante" description="Formulario para que los usuarios se registren" icon="👤" />;
export const PlayGame = () => <PlaceholderPage title="Jugar" description="Interface para participar en el juego" icon="🎯" />;
export const ThankYou = () => <PlaceholderPage title="¡Gracias por Jugar!" description="Página de agradecimiento post-juego" icon="🎉" />;

// Páginas de ventas y billing
export const PricingPage = () => <PlaceholderPage title="Precios" description="Planes y precios de la plataforma" icon="💰" />;
export const CheckoutPage = () => <PlaceholderPage title="Checkout" description="Proceso de pago con MercadoPago" icon="💳" />;
export const HomePage = () => <PlaceholderPage title="Inicio" description="Página principal de la aplicación" icon="🏠" />;
