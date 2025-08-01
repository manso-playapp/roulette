import React, { useState, useEffect } from 'react';
import { PlatformHealth, ServiceHealth } from '../../types';
import { runCompleteHealthCheck } from '../../firebase/healthCheck';

const HealthCheckPage: React.FC = () => {
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const checkAllServices = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Ejecutando health check real...');
      const results = await runCompleteHealthCheck();
      
      // Convertir resultados al formato esperado
      const servicesHealth = Object.keys(results).reduce((acc, key) => {
        const result = results[key];
        acc[key as keyof PlatformHealth['services']] = {
          service: key,
          status: result.status,
          lastCheck: result.lastCheck,
          latency: result.latency,
          message: result.message,
          details: result.details
        };
        return acc;
      }, {} as PlatformHealth['services']);

      // Determinar estado general
      const servicesList = Object.values(servicesHealth);
      const connectedCount = servicesList.filter(s => s.status === 'connected').length;
      const errorCount = servicesList.filter(s => s.status === 'error').length;
      
      let overallStatus: 'healthy' | 'degraded' | 'down';
      if (errorCount === 0 && connectedCount >= 4) {
        overallStatus = 'healthy';
      } else if (errorCount <= 2) {
        overallStatus = 'degraded';
      } else {
        overallStatus = 'down';
      }

      const platformHealth: PlatformHealth = {
        overall: overallStatus,
        services: servicesHealth,
        lastUpdate: new Date()
      };

      setHealth(platformHealth);
      setLastRefresh(new Date());
      
      console.log('✅ Health check completado:', platformHealth);
    } catch (error) {
      console.error('❌ Error en health check:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAllServices();
  }, []);

  const getStatusIcon = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'connected': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      case 'disabled': return '⚪';
      default: return '🔘';
    }
  };

  const getStatusText = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'warning': return 'Advertencia';
      case 'error': return 'Error';
      case 'disabled': return 'Deshabilitado';
      default: return 'Desconocido';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && !health) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Verificando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estado general */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estado de Servicios</h1>
            <p className="text-gray-600">Monitoreo en tiempo real de todas las conexiones</p>
          </div>
          
          <button
            onClick={checkAllServices}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            <span>{loading ? 'Verificando...' : 'Actualizar'}</span>
          </button>
        </div>

        {health && (
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full font-medium ${getOverallStatusColor(health.overall)}`}>
              Estado General: {health.overall === 'healthy' ? '✅ Saludable' : 
                              health.overall === 'degraded' ? '⚠️ Degradado' : 
                              '❌ Crítico'}
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Grid de servicios */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(health.services).map(([serviceName, service]) => (
            <div key={serviceName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(service.status)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {serviceName === 'mercadoPago' ? 'MercadoPago' : serviceName}
                    </h3>
                    <p className="text-sm text-gray-600">{getStatusText(service.status)}</p>
                  </div>
                </div>
                
                {service.latency && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{service.latency}ms</div>
                    <div className="text-xs text-gray-500">latencia</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-700">{service.message}</p>
                
                {service.details && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Detalles:</h4>
                    <div className="space-y-1">
                      {Object.entries(service.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="text-gray-900 font-medium">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Última verificación: {service.lastCheck.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sección de logs (placeholder) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Logs Recientes</h2>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
            <span className="text-gray-700">Firebase Auth: Usuario autenticado correctamente</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">ℹ️</span>
            <span className="text-gray-500">{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
            <span className="text-gray-700">Firestore: Consulta ejecutada en 45ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-gray-500">{new Date(Date.now() - 120000).toLocaleTimeString()}</span>
            <span className="text-gray-700">Email Service: Configuración pendiente</span>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">🔧 Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-left">
            <div className="font-medium">Configurar Email</div>
            <div className="text-sm text-blue-100">Habilitar notificaciones por email</div>
          </button>
          
          <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-left">
            <div className="font-medium">Setup MercadoPago</div>
            <div className="text-sm text-blue-100">Configurar pasarela de pagos</div>
          </button>
          
          <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-left">
            <div className="font-medium">Test Connection</div>
            <div className="text-sm text-blue-100">Ejecutar pruebas completas</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckPage;
