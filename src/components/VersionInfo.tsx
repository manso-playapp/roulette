import React from 'react';
import { useVersion } from '../hooks/useVersion';

interface VersionBadgeProps {
  variant?: 'full' | 'simple' | 'build';
  className?: string;
}

export function VersionBadge({ variant = 'simple', className = '' }: VersionBadgeProps) {
  const version = useVersion();

  const getContent = () => {
    switch (variant) {
      case 'full':
        return version.getFullVersionDisplay();
      case 'build':
        return version.getBuildInfo();
      case 'simple':
      default:
        return version.getVersionDisplay();
    }
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      bg-gradient-to-r from-purple-100 to-blue-100 
      text-purple-800 border border-purple-200
      ${className}
    `}>
      {getContent()}
    </span>
  );
}

export function VersionInfo() {
  const version = useVersion();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Información de la Plataforma
        </h3>
        <VersionBadge variant="simple" />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Versión Completa:</span>
          <span className="font-mono text-sm">{version.getFullVersionDisplay()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Build:</span>
          <span className="font-mono text-sm">{version.getBuildInfo()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Entorno:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            version.environment === 'production' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {version.environment}
          </span>
        </div>

        <div className="border-t pt-3 mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Estado de Características:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(version.features).map(([feature, featureVersion]) => (
              <div key={feature} className="flex justify-between">
                <span className="capitalize text-gray-600">{feature}:</span>
                <span className="font-mono">v{featureVersion}</span>
              </div>
            ))}
          </div>
        </div>

        {version.isLatest && (
          <div className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Versión actualizada
          </div>
        )}
      </div>
    </div>
  );
}

export function ReleaseNotes() {
  const version = useVersion();
  const currentRelease = version.changelog[version.version];

  if (!currentRelease) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">🚀</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentRelease.title}
          </h3>
          <p className="text-sm text-gray-600">
            Lanzado el {currentRelease.date}
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-4">
        {currentRelease.description}
      </p>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">✨ Características Destacadas:</h4>
        <ul className="space-y-1">
          {currentRelease.highlights.map((highlight: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-sm text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
