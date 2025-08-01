import { useState, useEffect } from 'react';
import versionData from '../../version.json';

export interface VersionInfo {
  version: string;
  name: string;
  codename: string;
  releaseDate: string;
  build: number;
  environment: string;
  features: Record<string, string>;
  changelog: Record<string, any>;
}

export function useVersion() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>(versionData as VersionInfo);
  const [isLatest, setIsLatest] = useState(true);

  useEffect(() => {
    // En el futuro, aquí podrías verificar contra un API si hay actualizaciones
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Placeholder para verificación de actualizaciones
      // const response = await fetch('/api/version/check');
      // const latestVersion = await response.json();
      // setIsLatest(compareVersions(versionInfo.version, latestVersion.version) >= 0);
      
      setIsLatest(true); // Por ahora siempre es la última
    } catch (error) {
      console.warn('No se pudo verificar actualizaciones:', error);
    }
  };

  const getVersionDisplay = () => {
    return `v${versionInfo.version}`;
  };

  const getFullVersionDisplay = () => {
    return `${versionInfo.name} v${versionInfo.version} "${versionInfo.codename}"`;
  };

  const getBuildInfo = () => {
    return `Build ${versionInfo.build} - ${versionInfo.releaseDate}`;
  };

  const getFeatureVersion = (feature: string) => {
    return versionInfo.features[feature] || '0.0.0';
  };

  const isFeatureAvailable = (feature: string, requiredVersion = '1.0.0') => {
    const featureVersion = getFeatureVersion(feature);
    return compareVersions(featureVersion, requiredVersion) >= 0;
  };

  // Comparador de versiones simple (MAJOR.MINOR.PATCH)
  const compareVersions = (version1: string, version2: string): number => {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  };

  return {
    ...versionInfo,
    isLatest,
    getVersionDisplay,
    getFullVersionDisplay,
    getBuildInfo,
    getFeatureVersion,
    isFeatureAvailable,
    checkForUpdates,
  };
}
