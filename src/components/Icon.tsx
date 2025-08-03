import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  variant?: 'default' | 'muted' | 'accent';
}

/**
 * Componente de icono unificado que usa Lucide icons
 * Maneja automáticamente los colores según el contexto:
 * - default: Blanco en modo oscuro, violeta en modo claro
 * - muted: Gris en ambos modos
 * - accent: Colores de estado (verde, amarillo, etc.)
 */
const Icon: React.FC<IconProps> = ({ 
  icon: LucideIcon, 
  size = 20, 
  className = '', 
  variant = 'default' 
}) => {
  const getColorClass = () => {
    switch (variant) {
      case 'muted':
        return 'text-gray-400';
      case 'accent':
        return className.includes('text-') ? '' : 'text-purple-400';
      case 'default':
      default:
        // Blanco en modo oscuro (que es nuestro modo actual)
        // En el futuro, cuando implementemos modo claro, podríamos usar:
        // return 'text-white dark:text-white light:text-purple-600';
        return 'text-white';
    }
  };

  return (
    <LucideIcon 
      size={size} 
      className={`${getColorClass()} ${className}`}
    />
  );
};

export default Icon;
